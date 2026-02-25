import React, { useState, useMemo } from 'react';
import { Plus, Minus, Monitor, Car, X } from 'lucide-react';
import type { Pets, UVL1, VehicleDataStatus } from '@/services/data';
import PetsEntryCard from './PetsEntryCard';
import { Button } from '@/components/ui/button';
import { cn, formatEnglishLabel } from '@/lib/utils';
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
    const currentVehicleOperable = currentVehicleHasData;

    const handleSelectPets = (petsId: string) => {
        if (!addMode) return;
        const pets = petsList.find(p => p.id === petsId);
        if (pets) {
            onAddPets(petsId, pets.name, addMode);
        }
        setAddMode(null);
    };

    return (
        <div className="surface-panel flex h-full flex-col rounded-card">
            {/* Header */}
            <div className="surface-divider-bottom flex flex-col">
                <div className="p-4 pb-2">
                    <h2 className="text-base font-semibold text-foreground">体验维度录入</h2>
                </div>

                {/* 车型 Tabs */}
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {vehicles.map(v => {
                        const isActive = currentVehicle === v;
                        const status = vehiclesDataStatus.find(s => s.id.toLowerCase() === v.toLowerCase());
                        const hasData = status?.hasData ?? false;

                        return (
                            <button
                                key={v}
                                onClick={() => onVehicleChange(v)}
                                disabled={!hasData}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-control px-3 py-1.5 text-xs font-medium transition-[color,background-color,box-shadow]",
                                    isActive && hasData
                                        ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(19,127,236,0.24)]"
                                        : "surface-inset text-muted-foreground hover:bg-slate-100 hover:text-foreground",
                                    !hasData && "text-slate-400 hover:bg-transparent hover:text-slate-400"
                                )}
                            >
                                <Car className="h-3.5 w-3.5" />
                                {formatEnglishLabel(v)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 两个添加按钮 */}
            <div className={cn("surface-divider-bottom p-4", !currentVehicleOperable && "surface-disabled")}>
                <div className="flex gap-4">
                    <button
                        className={cn(
                            "flex h-10 flex-1 items-center justify-center gap-2 rounded-control text-sm font-medium transition-[color,background-color,box-shadow] outline-none focus-visible:ring-4 focus-visible:ring-success/20",
                            addMode === 'enhanced'
                                ? "bg-success text-success-foreground shadow-[0_10px_22px_rgba(22,163,74,0.24)]"
                                : "surface-tint-success text-success hover:bg-success/15",
                            (!availablePets.length || !currentVehicleOperable) && "opacity-50 cursor-not-allowed grayscale"
                        )}
                        onClick={() => {
                            if (availablePets.length > 0 && currentVehicleOperable) {
                                setAddMode(addMode === 'enhanced' ? null : 'enhanced');
                            }
                        }}
                        disabled={availablePets.length === 0 || !currentVehicleOperable}
                    >
                        <Plus className="h-4 w-4" />
                        提升体验
                    </button>
                    <button
                        className={cn(
                            "flex h-10 flex-1 items-center justify-center gap-2 rounded-control text-sm font-medium transition-[color,background-color,box-shadow] outline-none focus-visible:ring-4 focus-visible:ring-destructive/20",
                            addMode === 'reduced'
                                ? "bg-destructive text-destructive-foreground shadow-[0_10px_22px_rgba(220,38,38,0.24)]"
                                : "surface-tint-error text-destructive hover:bg-destructive/15",
                            (!availablePets.length || !currentVehicleOperable) && "opacity-50 cursor-not-allowed grayscale"
                        )}
                        onClick={() => {
                            if (availablePets.length > 0 && currentVehicleOperable) {
                                setAddMode(addMode === 'reduced' ? null : 'reduced');
                            }
                        }}
                        disabled={availablePets.length === 0 || !currentVehicleOperable}
                    >
                        <Minus className="h-4 w-4" />
                        降低体验
                    </button>
                </div>
            </div>

            {/* PETS 选择面板 */}
            {addMode && availablePets.length > 0 && currentVehicleOperable && (
                <div className="surface-inset px-4 py-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            选择要<span className={addMode === 'enhanced' ? "text-success" : "text-destructive"}>{addMode === 'enhanced' ? '提升' : '降低'}</span>的维度:
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setAddMode(null)}>
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                        {availablePets.map(pets => (
                            <button
                                key={pets.id}
                                className="surface-panel-soft px-3 py-2 text-sm rounded-control text-text-secondary hover:bg-white hover:text-primary transition-colors text-left truncate"
                                onClick={() => handleSelectPets(pets.id)}
                            >
                                {pets.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className={cn("flex-1 overflow-y-auto p-4", !currentVehicleOperable && "surface-disabled")}>
                {petsEntries.length === 0 ? (
                    <div className="surface-inset mt-4 flex flex-col items-center justify-center rounded-card p-8 text-center">
                        <div className="mb-4 rounded-full bg-slate-100 p-3">
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
