import api from './api';

export interface Vehicle {
    id: string;
    name: string;
}

export interface Pets {
    id: string;
    name: string;
}

export interface UVL2 {
    id: number;
    name: string;
}

export interface UVL1 {
    l1_id: number;
    l1_name: string;
    l2_items: UVL2[];
}

export interface VehicleDataStatus {
    id: string;
    name: string;
    hasData: boolean;
}

export const dataService = {
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get<Vehicle[]>('/data/vehicles');
        return response.data;
    },

    getVehiclesDataStatus: async (): Promise<VehicleDataStatus[]> => {
        const response = await api.get<VehicleDataStatus[]>('/data/vehicles-data-status');
        return response.data;
    },

    getPets: async (): Promise<Pets[]> => {
        const response = await api.get<Pets[]>('/data/pets');
        return response.data;
    },

    getUVData: async (): Promise<UVL1[]> => {
        const response = await api.get<UVL1[]>('/data/uv');
        return response.data;
    },

    calculateUVA: async (payload: any): Promise<any> => {
        const response = await api.post('/uva/calculate', payload);
        return response.data;
    },

    saveAnalysis: async (payload: any): Promise<any> => {
        const response = await api.post('/uva/save', payload);
        return response.data;
    },

    getProjectAnalysis: async (projectId: string): Promise<any[]> => {
        const response = await api.get(`/uva/project/${projectId}`);
        return response.data;
    }
};
