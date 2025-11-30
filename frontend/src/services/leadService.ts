import api from '@/lib/axios';
import { z } from 'zod';

export const LeadSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, "Name is required"),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    source: z.string().optional(),
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']).optional(),
    assignedToId: z.number().optional(),
    assignedToName: z.string().optional(),
    notes: z.string().optional(),
    tenantId: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

export const LeadService = {
    getAllLeads: async () => {
        const response = await api.get<Lead[]>('/leads');
        return response.data;
    },
    createLead: async (data: Lead) => {
        const response = await api.post<Lead>('/leads', data);
        return response.data;
    },
    updateLead: async (id: number, data: Lead) => {
        const response = await api.put<Lead>(`/leads/${id}`, data);
        return response.data;
    },
    deleteLead: async (id: number) => {
        await api.delete(`/leads/${id}`);
    },
    assignLead: async (leadId: number, userId: number) => {
        const response = await api.put<Lead>(`/leads/${leadId}/assign/${userId}`);
        return response.data;
    },
    updateStatus: async (leadId: number, status: string) => {
        const response = await api.put<Lead>(`/leads/${leadId}/status`, null, {
            params: { status }
        });
        return response.data;
    }
};
