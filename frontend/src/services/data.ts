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

// 缓存已加载的 UVA 矩阵数据
const uvaMatrixCache: Record<string, unknown[]> = {};

export const dataService = {
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await fetch('/data/vehicles.json');
        if (!response.ok) throw new Error('无法加载车型数据');
        return response.json();
    },

    getVehiclesDataStatus: async (): Promise<VehicleDataStatus[]> => {
        // 已知有数据的车型（与 public/data/uva-matrix/ 目录对应）
        const VEHICLES_WITH_DATA = ['cetus'];
        const vehicles = await dataService.getVehicles();
        return vehicles.map(v => ({
            id: v.id,
            name: v.name,
            hasData: VEHICLES_WITH_DATA.includes(v.id.toLowerCase()),
        }));
    },

    getPets: async (): Promise<Pets[]> => {
        const response = await fetch('/data/pets.json');
        if (!response.ok) throw new Error('无法加载 PETS 数据');
        return response.json();
    },

    getUVData: async (): Promise<UVL1[]> => {
        const response = await fetch('/data/uv.json');
        if (!response.ok) throw new Error('无法加载 UV 数据');
        return response.json();
    },

    getUvaMatrix: async (vehicle: string): Promise<unknown[]> => {
        const key = vehicle.toLowerCase();
        if (uvaMatrixCache[key]) return uvaMatrixCache[key];
        const response = await fetch(`/data/uva-matrix/${key}.json`);
        if (!response.ok) {
            const fallback = await fetch('/data/uva-matrix/cetus.json');
            if (!fallback.ok) throw new Error('该车型暂无 UVA 数据');
            const data = await fallback.json();
            uvaMatrixCache[key] = data;
            return data;
        }
        const data = await response.json();
        uvaMatrixCache[key] = data;
        return data;
    },

    calculateUVA: async (payload: CalculateUvaPayload): Promise<CalculateUvaResponse> => {
        const { calculateUVAFrontend } = await import('./uva-calculator');
        return calculateUVAFrontend(payload);
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
