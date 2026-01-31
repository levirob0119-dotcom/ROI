import api from './api';
import type { AuthResponse } from '@/types/models';


export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', { username, password });
        return response.data;
    },

    register: async (username: string, password: string, displayName?: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', { username, password, displayName });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};
