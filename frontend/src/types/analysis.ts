// 重构后的数据类型

export interface PetsEntry {
    petsId: string;
    petsName: string;
    type: 'enhanced' | 'reduced';
    uvL2Names: string[];
    isExpanded: boolean;
}

export interface AnalysisValidationState {
    canCalculate: boolean;
    blockers: string[];
    selectedPetsCount: number;
    selectedUvCount: number;
    hasVehicleData: boolean;
}

export interface VehicleAnalysis {
    petsEntries: PetsEntry[];
    kanoType?: 'must-be' | 'performance' | 'attractive';
    usageRate?: number;
    penetrationRate?: number;
    dirty?: boolean;
    lastCalculatedAt?: string;
    validationState?: AnalysisValidationState;
}

export type ProjectAnalysisData = Record<string, VehicleAnalysis>;
