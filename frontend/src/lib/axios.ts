import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust if your backend port differs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Prioritize cookie as it's updated by middleware
    const token = getCookie('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401/403
// Response interceptor to handle 401/403
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];
let hasRedirected = false; // Prevent multiple redirects

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (token) prom.resolve(token);
    }
  });

  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  if (hasRedirected) return; // Prevent multiple redirects
  hasRedirected = true;

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

  // Use a small timeout to ensure cleanup completes
  setTimeout(() => {
    window.location.href = '/login';
  }, 100);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token, logout
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken
        });

        const { accessToken } = response.data;

        localStorage.setItem('token', accessToken);
        // Update cookie if needed
        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Strict`;

        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err as Error, null);
        clearAuthAndRedirect();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
