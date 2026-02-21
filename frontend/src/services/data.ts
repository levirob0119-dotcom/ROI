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

export interface SelectedPetsPayload {
    petsId: string;
    petsName: string;
    uvL2Names: string[];
}

export interface CalculateUvaPayload {
    vehicle: string;
    enhancedPets: SelectedPetsPayload[];
    reducedPets: SelectedPetsPayload[];
    kanoType?: 'must-be' | 'performance' | 'attractive';
    usageRate?: number;
    penetrationRate?: number;
}

interface ResultL2 {
    l2Name: string;
    score: number;
}

interface ResultL1 {
    l1Name: string;
    totalScore: number;
    l2List: ResultL2[];
}

interface RequirementGroup {
    categoryName: string;
    totalScore: number;
    l1List: ResultL1[];
}

export interface ResultPetsNode {
    petsId: string;
    petsName: string;
    totalScore: number;
    requirementGroups: RequirementGroup[];
}

interface CalculateSectionResult {
    totalScore: number;
    petsList: ResultPetsNode[];
}

export interface CalculateMeta {
    validationSummary: {
        hasSelections: boolean;
        missingKanoType: boolean;
        missingUsageRate: boolean;
        missingPenetrationRate: boolean;
    };
    selectionCount: {
        pets: number;
        uv: number;
        enhanced: number;
        reduced: number;
    };
}

export interface CalculateUvaResponse {
    vehicle: string;
    enhanced: CalculateSectionResult;
    reduced: CalculateSectionResult;
    totalEnhanced: number;
    totalReduced: number;
    finalScore: number;
    meta: CalculateMeta;
}

export interface SaveAnalysisPayload {
    projectId: string;
    vehicle: string;
    enhancedPets: SelectedPetsPayload[];
    reducedPets: SelectedPetsPayload[];
    kanoType?: 'must-be' | 'performance' | 'attractive';
    usageRate?: number;
    penetrationRate?: number;
    result?: CalculateUvaResponse;
    draft?: boolean;
    clientUpdatedAt?: string;
}

export interface ProjectAnalysisRecord {
    id: string;
    projectId: string;
    vehicle: string;
    enhancedPets: SelectedPetsPayload[];
    reducedPets: SelectedPetsPayload[];
    kanoType?: 'must-be' | 'performance' | 'attractive';
    usageRate?: number;
    penetrationRate?: number;
    result?: CalculateUvaResponse;
    draft?: boolean;
    clientUpdatedAt?: string;
    isDraft: boolean;
    analysisMeta: {
        isDraft: boolean;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
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

    calculateUVA: async (payload: CalculateUvaPayload): Promise<CalculateUvaResponse> => {
        const response = await api.post<CalculateUvaResponse>('/uva/calculate', payload);
        return response.data;
    },

    saveAnalysis: async (payload: SaveAnalysisPayload): Promise<ProjectAnalysisRecord> => {
        const response = await api.post<ProjectAnalysisRecord>('/uva/save', payload);
        return response.data;
    },

    getProjectAnalysis: async (projectId: string): Promise<ProjectAnalysisRecord[]> => {
        const response = await api.get<ProjectAnalysisRecord[]>(`/uva/project/${projectId}`);
        return response.data;
    }
};
