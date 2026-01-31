// 重构后的数据类型

export interface PetsEntry {
    petsId: string;
    petsName: string;
    type: 'enhanced' | 'reduced';
    uvL2Names: string[];
    isExpanded?: boolean;
}

export interface VehicleAnalysis {
    petsEntries: PetsEntry[];
    kanoType?: 'must-be' | 'performance' | 'attractive';
    usageRate?: number;
    penetrationRate?: number;
}

export type ProjectAnalysisData = Record<string, VehicleAnalysis>;
