import React from 'react';
import { type UVL1 } from '@/services/data';
import { Checkbox } from '@/components/ui/checkbox';

interface UVSelectionTableProps {
    uvData: UVL1[];
    selectedUVs: string[]; // List of selected UV L2 Names, now stored as l2_names or IDs
    onToggle: (uvL2Name: string) => void;
}

const UVSelectionTable: React.FC<UVSelectionTableProps> = ({ uvData, selectedUVs, onToggle }) => {
    return (
        <div className="surface-panel overflow-hidden rounded-card">
            <div className="surface-inset flex items-center justify-between px-4 py-3">
                <h3 className="font-semibold text-slate-700">UV 价值点选择</h3>
                <span className="text-xs text-slate-500">已选 {selectedUVs.length} 项</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {uvData.map((l1) => (
                        <div key={l1.l1_id} className="break-inside-avoid">
                            <h4 className="surface-divider-bottom mb-2 flex items-center gap-2 pb-2 font-bold text-slate-800">
                                <span className="h-4 w-1.5 rounded-full bg-primary"></span>
                                {l1.l1_name}
                            </h4>
                            <div className="space-y-1">
                                {l1.l2_items.map((l2) => {
                                    const isSelected = selectedUVs.includes(l2.name);
                                    return (
                                        <label
                                            key={l2.id}
                                            className={`flex cursor-pointer items-start gap-2 rounded-control p-2 transition-colors ${isSelected
                                                    ? 'surface-tint-info text-info'
                                                    : 'surface-inset text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            <Checkbox
                                                className="mt-1"
                                                checked={isSelected}
                                                onCheckedChange={() => onToggle(l2.name)}
                                                aria-label={`选择 ${l2.name}`}
                                            />
                                            <span className="text-sm leading-snug">{l2.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UVSelectionTable;
