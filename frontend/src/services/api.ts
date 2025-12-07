import api from '@/lib/axios';
import { z } from 'zod';

export const TenantSchema = z.object({
    id: z.number().int().positive().optional(),
    tenantId: z.string().uuid(),
    name: z.string().min(1, "Tenant name is required"),
    contactEmail: z.string().email(),
    phone: z.string().optional(),
    active: z.boolean().default(true).optional(),
    subDomain: z.string().optional(),
    logoUrl: z.string().url().optional(),

    primaryColor: z.string().optional(),

    secondaryColor: z.string().optional(),
    website: z.string().url().optional(),
});

export type Tenant = z.infer<typeof TenantSchema>;

export const TenantService = {
    getAllTenants: async () => {
        const response = await api.get<Tenant[]>('/tenants');
        return response.data;
    },
    getCurrentTenant: async (tenantId: string) => {
        const response = await api.get<Tenant>(`/tenants/${tenantId}`);
        return response.data;
    },
    updateTenant: async (id: number, data: Tenant) => {
        const response = await api.put<Tenant>(`/tenants/${id}`, data);
        return response.data;
    },
    onboardTenant: async (data: OnboardTenantRequest) => {
        const response = await api.post<Tenant>('/onboard-tenant', data);
        return response.data;
    }
};

// --- User Schemas ---
export const UserSchema = z.object({
    id: z.number().optional(),
    username: z.string(),
    email: z.string().email(),
    fullName: z.string().optional(),
    enabled: z.boolean().optional(),
    roles: z.array(z.string()).optional(),
    password: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserService = {
    getAllUsers: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },
    createUser: async (data: User) => {
        const response = await api.post<User>('/users', data);
        return response.data;
    },
    updateUser: async (id: number, data: User) => {
        const response = await api.put<User>(`/users/${id}`, data);
        return response.data;
    },
    deleteUser: async (id: number) => {
        await api.delete(`/users/${id}`);
    },
    getCurrentUser: async () => {
        const response = await api.get<User>('/users/me');
        return response.data;
    }
};

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    role?: string;
    tenantId?: string;
}

export interface OnboardTenantRequest {
    tenantId: string;
    tenantName: string;
    contactEmail: string;
    phone?: string;
    subDomain?: string;
    username: string;
    userEmail: string;
    password: string;
    fullName: string;
}

export const AuthService = {
    login: async (data: LoginRequest) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    register: async (data: RegisterRequest) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },
    verifyEmail: async (token: string) => {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        return response.data;
    },
    forgotPassword: async (email: string) => {
        const response = await api.post(`/auth/forgot-password?email=${email}`);
        return response.data;
    },
    resetPassword: async (token: string, newPassword: string) => {
        const response = await api.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`);
        return response.data;
    }
};
