import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Permission {
    id: number;
    name: string;
    description: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}

export const roleService = {
    getAllRoles: async (): Promise<Role[]> => {
        const response = await axios.get(`${API_URL}/roles`, {
            withCredentials: true,
        });
        return response.data;
    },

    getAllPermissions: async (): Promise<Permission[]> => {
        const response = await axios.get(`${API_URL}/roles/permissions`, {
            withCredentials: true,
        });
        return response.data;
    },

    createRole: async (role: Partial<Role>): Promise<Role> => {
        const response = await axios.post(`${API_URL}/roles`, role, {
            withCredentials: true,
        });
        return response.data;
    },

    updateRole: async (id: number, role: Partial<Role>): Promise<Role> => {
        const response = await axios.put(`${API_URL}/roles/${id}`, role, {
            withCredentials: true,
        });
        return response.data;
    },

    deleteRole: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/roles/${id}`, {
            withCredentials: true,
        });
    },
};
