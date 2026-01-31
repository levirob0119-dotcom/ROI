import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, Minus, Check } from 'lucide-react';
import type { UVL1 } from '@/services/data';
import type { PetsEntry } from '@/types/analysis';

interface PetsEntryCardProps {
    entry: PetsEntry;
    uvData: UVL1[];
    onToggleExpand: () => void;
    onDelete: () => void;
    onToggleUV: (uvL2Name: string) => void;
}

const PetsEntryCard: React.FC<PetsEntryCardProps> = ({
    entry,
    uvData,
    onToggleExpand,
    onDelete,
    onToggleUV
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const isEnhanced = entry.type === 'enhanced';

    // Filter UV data based on search
    const filteredUvData = uvData.filter(l1 =>
        l1.l1_name.includes(searchTerm) ||
        l1.l2_items.some(l2 => l2.name.includes(searchTerm))
    );

    return (
        <div className={`bg-white rounded-xl border-2 ${isEnhanced ? 'border-green-200' : 'border-red-200'} overflow-hidden`}>
            {/* Header */}
            <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer ${isEnhanced ? 'bg-green-50' : 'bg-red-50'}`}
                onClick={onToggleExpand}
            >
                <div className="flex items-center gap-3">
                    {entry.isExpanded ? (
                        <ChevronDown size={18} className="text-gray-500" />
                    ) : (
                        <ChevronRight size={18} className="text-gray-500" />
                    )}
                    <span className="font-bold text-gray-900">{entry.petsName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isEnhanced ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                        {isEnhanced ? <Plus size={12} className="inline" /> : <Minus size={12} className="inline" />}
                        {isEnhanced ? ' 增强' : ' 减弱'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {entry.uvL2Names.length} 个 UV
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Expanded Content - UV Selection */}
            {entry.isExpanded && (
                <div className="p-4 border-t border-gray-100">
                    {/* Search */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="搜索 UV..."
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* UV List */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredUvData.map(l1 => (
                            <div key={l1.l1_id} className="border border-gray-100 rounded-lg overflow-hidden">
                                <div className="px-3 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                                    {l1.l1_name}
                                </div>
                                <div className="p-2 space-y-1">
                                    {l1.l2_items.map(l2 => {
                                        const isSelected = entry.uvL2Names.includes(l2.name);
                                        return (
                                            <label
                                                key={l2.id}
                                                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? (isEnhanced ? 'bg-green-50' : 'bg-red-50') : ''
                                                    }`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                                                        ? (isEnhanced ? 'bg-green-600 border-green-600' : 'bg-red-500 border-red-500')
                                                        : 'border-gray-300'
                                                        }`}
                                                    onClick={() => onToggleUV(l2.name)}
                                                >
                                                    {isSelected && <Check size={10} className="text-white" />}
                                                </div>
                                                <span className="text-sm text-gray-700">{l2.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetsEntryCard;
