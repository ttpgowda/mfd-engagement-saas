import api from '@/lib/axios';

export enum TemplateCategory {
    SOCIAL_MEDIA = 'SOCIAL_MEDIA',
    BUSINESS_CARD = 'BUSINESS_CARD',
    FLYER = 'FLYER',
    BANNER = 'BANNER',
    INVESTMENT_TIP = 'INVESTMENT_TIP',
    FUND_PERFORMANCE = 'FUND_PERFORMANCE',
    FESTIVAL = 'FESTIVAL',
    QUOTE = 'QUOTE',
    GENERIC = 'GENERIC',
    CUSTOM = 'CUSTOM'
}

export interface Template {
    id?: number;
    name: string;
    description?: string;
    category: TemplateCategory;
    subCategory?: string;
    templateData?: Record<string, any>;
    logoUrl?: string;
    isPublic?: boolean;

    // Customization fields
    companyName?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;

    // Design customization
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;

    previewImageUrl?: string;

    // Audit fields
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export const TemplateService = {
    getAllTemplates: async () => {
        const response = await api.get<Template[]>('/templates');
        return response.data;
    },

    getTemplateById: async (id: number) => {
        const response = await api.get<Template>(`/templates/${id}`);
        return response.data;
    },

    createTemplate: async (data: Template) => {
        const response = await api.post<Template>('/templates', data);
        return response.data;
    },

    updateTemplate: async (id: number, data: Template) => {
        const response = await api.put<Template>(`/templates/${id}`, data);
        return response.data;
    },

    deleteTemplate: async (id: number) => {
        await api.delete(`/templates/${id}`);
    },

    getPublicTemplates: async () => {
        const response = await api.get<Template[]>('/templates/public');
        return response.data;
    },

    getTemplatesByCategory: async (category: TemplateCategory) => {
        const response = await api.get<Template[]>(`/templates/category/${category}`);
        return response.data;
    },

    searchTemplates: async (query: string) => {
        const response = await api.get<Template[]>('/templates/search', {
            params: { query }
        });
        return response.data;
    },

    uploadLogo: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ logoUrl: string }>('/templates/upload-logo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.logoUrl;
    },
};
