import React from 'react';
import { type UVL1 } from '@/services/data';

interface UVSelectionTableProps {
    uvData: UVL1[];
    selectedUVs: string[]; // List of selected UV L2 Names
    onToggle: (uvL2Name: string) => void;
}

const UVSelectionTable: React.FC<UVSelectionTableProps> = ({ uvData, selectedUVs, onToggle }) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">UV 价值点选择</h3>
                <span className="text-xs text-gray-500">已选 {selectedUVs.length} 项</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {uvData.map((l1) => (
                        <div key={l1.name} className="break-inside-avoid">
                            <h4 className="font-bold text-gray-800 mb-2 pb-1 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                                {l1.name}
                            </h4>
                            <div className="space-y-1">
                                {l1.items.map((l2) => {
                                    const isSelected = selectedUVs.includes(l2);
                                    return (
                                        <label
                                            key={l2}
                                            className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={isSelected}
                                                onChange={() => onToggle(l2)}
                                            />
                                            <span className="text-sm leading-snug">{l2}</span>
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
