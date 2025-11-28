import api from '@/lib/axios';
import { z } from 'zod';

// --- Mutual Fund Schemas ---
export const SchemeMasterSchema = z.object({
    schemeCode: z.number(),
    schemeName: z.string(),
    isTracked: z.boolean().optional(),
    isBackfilled: z.boolean().optional(),
    fundHouse: z.string().optional(),
    schemeCategory: z.string().optional(),
    isinGrowth: z.string().optional(),
    isinDivReinvestment: z.string().optional(),
});

export const SchemeAnalyticsSchema = z.object({
    schemeCode: z.number(),
    lastUpdated: z.string().optional(),
    navCurrent: z.number().optional(),
    return1y: z.number().optional(),
    return3y: z.number().optional(),
    return5y: z.number().optional(),
    returnInception: z.number().optional(),
    stdDev: z.number().optional(),
    sharpeRatio: z.number().optional(),
});

export const NavHistorySchema = z.object({
    schemeCode: z.number(),
    navDate: z.string(),
    navValue: z.number(),
});

export type SchemeMaster = z.infer<typeof SchemeMasterSchema>;
export type SchemeAnalytics = z.infer<typeof SchemeAnalyticsSchema>;
export type NavHistory = z.infer<typeof NavHistorySchema>;

// --- Tenant Schemas ---
export const TenantSchema = z.object({
    id: z.number().optional(),
    tenantId: z.string(),
    name: z.string(),
    contactEmail: z.string().email(),
    phone: z.string().optional(),
    active: z.boolean(),
    subDomain: z.string().optional(),
    logoUrl: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    website: z.string().optional(),
});

export type Tenant = z.infer<typeof TenantSchema>;

// --- Lead Schemas ---
export const LeadSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    source: z.string().optional(),
    status: z.string().optional(),
    tenantId: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// --- API Service ---
export const MutualFundService = {
    getAllSchemes: async (page = 0, size = 10) => {
        const response = await api.get<Page<SchemeMaster>>('/mutual-funds/schemes', {
            params: { page, size },
        });
        return response.data;
    },
    getSchemeById: async (id: number) => {
        const response = await api.get<SchemeMaster>(`/mutual-funds/schemes/${id}`);
        return response.data;
    },
    getAllAnalytics: async (page = 0, size = 10) => {
        const response = await api.get<Page<SchemeAnalytics>>('/mutual-funds/analytics', {
            params: { page, size },
        });
        return response.data;
    },
    getSchemeAnalytics: async (id: number) => {
        const response = await api.get<SchemeAnalytics>(`/mutual-funds/analytics/${id}`);
        return response.data;
    },
    getNavHistory: async (id: number, page = 0, size = 10) => {
        const response = await api.get<Page<NavHistory>>(`/mutual-funds/nav-history/${id}`, {
            params: { page, size },
        });
        return response.data;
    },
};

export const TenantService = {
    getAllTenants: async () => {
        const response = await api.get<Tenant[]>('/tenants');
        return response.data;
    },
    getCurrentTenant: async (tenantId: string) => {
        // In a real app, this might come from the domain or a specific endpoint
        // For now, we'll assume we can fetch by ID or use a 'me' endpoint if implemented
        // Since we don't have a 'get by domain' endpoint yet, we'll mock or use getById if known
        // But wait, the user asked to integrate. Let's assume we use the first tenant for demo or fetch by ID.
        // Let's add a method to get all tenants for admin, or get specific tenant.
        const response = await api.get<Tenant>(`/tenants/${tenantId}`); // Assuming we know the ID
        return response.data;
    },
    updateTenant: async (id: number, data: Tenant) => {
        const response = await api.put<Tenant>(`/tenants/${id}`, data);
        return response.data;
    },
    onboardTenant: async (data: any) => {
        const response = await api.post<Tenant>('/onboard-tenant', data);
        return response.data;
    }
};

export const LeadService = {
    createLead: async (data: Lead) => {
        const response = await api.post<Lead>('/leads', data);
        return response.data;
    },
    getAllLeads: async () => {
        const response = await api.get<Lead[]>('/leads');
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
    roles: z.array(z.string()).optional(), // Simplified role handling
    password: z.string().optional(), // For creation
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

export const AuthService = {
    login: async (data: any) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    register: async (data: any) => {
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
