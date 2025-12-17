import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080' + '/api',
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

// Helper to get tenant from subdomain
const getTenantFromSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname; // e.g., test2.localhost or tenant.domain.com
  const parts = host.split('.');

  // Logic: 
  // localhost -> parts=['localhost'] (length 1) -> null
  // test2.localhost -> parts=['test2', 'localhost'] (length 2) -> 'test2'
  // tenant.domain.com -> parts=['tenant', 'domain', 'com'] (length 3) -> 'tenant'
  // www.domain.com -> 'www' (ignored usually, or mapped to default)

  if (host === 'localhost') return null;

  // Simple heuristic: if parts > 2 (domain.com) or parts > 1 (localhost)
  // But be careful with 'domain.co.uk' etc. 
  // For this dev environment:
  if (host.endsWith('localhost')) {
    if (parts.length > 1 && parts[0] !== 'www') return parts[0];
    return null;
  }

  // For production (assuming 2-part TLD or config)
  // Just taking first part is a common strategy for SAAS
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }

  return null;
};

// Request interceptor to add JWT token and Tenant ID
api.interceptors.request.use(
  (config) => {
    // Prioritize cookie as it's updated by middleware
    const token = getCookie('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Auto-inject Tenant ID from subdomain
    const tenantId = getTenantFromSubdomain();
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
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
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

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

      const refreshToken = getCookie('refreshToken') || localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token, logout
        // BUT ignore if it's a public API call (might have failed for other reasons, don't force login)
        if (!originalRequest.url?.includes('/api/public/')) {
          clearAuthAndRedirect();
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/refresh`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('token', accessToken);
        // Update access token cookie
        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Strict`;

        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
          // Update refresh token cookie to keep middleware in sync
          document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=604800; SameSite=Strict`;
        }

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
