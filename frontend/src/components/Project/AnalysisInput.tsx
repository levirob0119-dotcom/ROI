import React, { useState, useMemo } from 'react';
import { Plus, Minus, Monitor, Car, AlertTriangle, X } from 'lucide-react';
import type { Pets, UVL1, VehicleDataStatus } from '@/services/data';
import PetsEntryCard from './PetsEntryCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// import './AnalysisInput.css'; // Legacy styles removed

// PETS 卡片条目
interface PetsEntry {
    petsId: string;
    petsName: string;
    type: 'enhanced' | 'reduced';
    uvL2Names: string[];
    isExpanded: boolean;
}

interface AnalysisInputProps {
    petsList: Pets[];
    uvData: UVL1[];
    vehicles: string[];
    vehiclesDataStatus: VehicleDataStatus[];
    currentVehicle: string;
    petsEntries: PetsEntry[];
    onVehicleChange: (vehicle: string) => void;
    onAddPets: (petsId: string, petsName: string, type: 'enhanced' | 'reduced') => void;
    onDeletePets: (petsId: string) => void;
    onToggleExpand: (petsId: string) => void;
    onToggleUV: (petsId: string, uvL2Name: string) => void;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({
    petsList,
    uvData,
    vehicles,
    vehiclesDataStatus,
    currentVehicle,
    petsEntries,
    onVehicleChange,
    onAddPets,
    onDeletePets,
    onToggleExpand,
    onToggleUV
}) => {
    // 当前选择的添加模式
    const [addMode, setAddMode] = useState<'enhanced' | 'reduced' | null>(null);

    const existingPetsIds = petsEntries.map(e => e.petsId);
    const availablePets = petsList.filter(p => !existingPetsIds.includes(p.id));

    // 检查当前车型是否有数据
    const currentVehicleHasData = useMemo(() => {
        const status = vehiclesDataStatus.find(v => v.id.toLowerCase() === currentVehicle.toLowerCase());
        return status?.hasData ?? false;
    }, [vehiclesDataStatus, currentVehicle]);

    const handleSelectPets = (petsId: string) => {
        if (!addMode) return;
        const pets = petsList.find(p => p.id === petsId);
        if (pets) {
            onAddPets(petsId, pets.name, addMode);
        }
        setAddMode(null);
    };

    return (
        <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
            {/* Header */}
            <div className="flex flex-col border-b">
                <div className="p-4 pb-2">
                    <h2 className="text-base font-semibold text-foreground">体验维度录入</h2>
                </div>

                {/* 车型 Tabs - Legacy Pill Style */}
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {vehicles.map(v => {
                        const isActive = currentVehicle === v;
                        const status = vehiclesDataStatus.find(s => s.id.toLowerCase() === v.toLowerCase());
                        const hasData = status?.hasData ?? false;

                        return (
                            <button
                                key={v}
                                onClick={() => onVehicleChange(v)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all border",
                                    isActive
                                        ? "bg-violet-500 text-white border-violet-500 shadow-sm" // Hardcoded Violet to match legacy design
                                        : "bg-white text-muted-foreground border-input hover:border-foreground/20 hover:text-foreground",
                                    !hasData && !isActive && "border-dashed opacity-70"
                                )}
                                title={hasData ? '' : '暂无 UVA 数据'}
                            >
                                <Car className="h-3.5 w-3.5" />
                                {v.toUpperCase()}
                                {!hasData && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 无数据警告横条 - Full Width Strip */}
            {!currentVehicleHasData && (
                <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-800 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>{currentVehicle.toUpperCase()} 暂无 UVA 数据，无法进行测算</span>
                </div>
            )}

            {/* 两个添加按钮 - Distinct Outlined Style */}
            <div className="p-4 border-b bg-white/50">
                <div className="flex gap-4">
                    <button
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium border-2 transition-all outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500",
                            addMode === 'enhanced'
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                                : "bg-white border-emerald-400 text-emerald-700 hover:bg-emerald-50",
                            (!availablePets.length || !currentVehicleHasData) && "opacity-50 cursor-not-allowed grayscale"
                        )}
                        onClick={() => {
                            if (availablePets.length > 0 && currentVehicleHasData) {
                                setAddMode(addMode === 'enhanced' ? null : 'enhanced');
                            }
                        }}
                        disabled={availablePets.length === 0 || !currentVehicleHasData}
                    >
                        <Plus className="h-4 w-4" />
                        增强体验
                    </button>
                    <button
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium border-2 transition-all outline-none focus:ring-2 focus:ring-offset-1 focus:ring-rose-500",
                            addMode === 'reduced'
                                ? "bg-rose-600 border-rose-600 text-white shadow-md"
                                : "bg-white border-rose-400 text-rose-700 hover:bg-rose-50",
                            (!availablePets.length || !currentVehicleHasData) && "opacity-50 cursor-not-allowed grayscale"
                        )}
                        onClick={() => {
                            if (availablePets.length > 0 && currentVehicleHasData) {
                                setAddMode(addMode === 'reduced' ? null : 'reduced');
                            }
                        }}
                        disabled={availablePets.length === 0 || !currentVehicleHasData}
                    >
                        <Minus className="h-4 w-4" />
                        减弱体验
                    </button>
                </div>
            </div>

            {/* PETS 选择面板 */}
            {addMode && availablePets.length > 0 && currentVehicleHasData && (
                <div className="px-4 py-3 bg-muted/30 border-b animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            选择要<span className={addMode === 'enhanced' ? "text-emerald-600" : "text-rose-600"}>{addMode === 'enhanced' ? '增强' : '减弱'}</span>的维度:
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setAddMode(null)}>
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                        {availablePets.map(pets => (
                            <button
                                key={pets.id}
                                className="px-3 py-2 text-sm bg-white border rounded-md hover:border-primary hover:text-primary transition-colors text-left truncate shadow-sm"
                                onClick={() => handleSelectPets(pets.id)}
                            >
                                {pets.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/5">
                {!currentVehicleHasData ? (
                    <div className="flex flex-col items-center justify-center p-8 mt-4 text-center border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-xl">
                        <div className="mb-4 p-3 bg-amber-100 rounded-full">
                            <AlertTriangle className="h-8 w-8 text-amber-500" />
                        </div>
                        <h3 className="text-base font-semibold text-amber-900">该车型暂无数据</h3>
                        <p className="mt-1 text-sm text-amber-700 max-w-[280px]">
                            请切换至有数据的车型（如 CETUS）或联系管理员导入数据
                        </p>
                    </div>
                ) : petsEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 mt-4 text-center border-2 border-dashed border-border rounded-xl">
                        <div className="mb-4 p-3 bg-muted rounded-full">
                            <Monitor className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">暂无录入数据</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            请点击上方按钮添加体验维度
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 pb-8">
                        {petsEntries.map(entry => (
                            <PetsEntryCard
                                key={entry.petsId}
                                entry={entry}
                                uvData={uvData}
                                onToggleExpand={() => onToggleExpand(entry.petsId)}
                                onDelete={() => onDeletePets(entry.petsId)}
                                onToggleUV={(uvName) => onToggleUV(entry.petsId, uvName)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisInput;
