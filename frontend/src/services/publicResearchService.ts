import axios from '@/lib/axios';
import { TopFundsRequest, TopFundsResponse } from '@/services/researchService';

const publicClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

// Add interceptor to inject Tenant ID same as main axios (or reuse logic if possible)
// But since this is public, we might rely on the main axios from lib/axios 
// IF we fixed the 401 redirect issue (which we did).
// BUT for clarity, let's use the main axios instance but target specific public endpoints.

import api from '@/lib/axios';

export const publicResearchService = {
    getCategories: async (): Promise<string[]> => {
        const response = await api.get<string[]>('/public/research/funds/categories');
        return response.data;
    },

    getTopPerformingFunds: async (request: TopFundsRequest): Promise<TopFundsResponse> => {
        const response = await api.post<TopFundsResponse>('/public/research/funds/top-performing', request);
        return response.data;
    }
};
