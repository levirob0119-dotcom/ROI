import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Pets } from '@/services/data';

interface AddPetsDialogProps {
    petsList: Pets[];
    existingPetsIds: string[];
    onAdd: (petsId: string, petsName: string, type: 'enhanced' | 'reduced') => void;
    onClose: () => void;
}

const AddPetsDialog: React.FC<AddPetsDialogProps> = ({
    petsList,
    existingPetsIds,
    onAdd,
    onClose
}) => {
    const [selectedPetsId, setSelectedPetsId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'enhanced' | 'reduced'>('enhanced');

    const availablePets = petsList.filter(p => !existingPetsIds.includes(p.id));
    const selectedPets = petsList.find(p => p.id === selectedPetsId);

    const handleConfirm = () => {
        if (selectedPetsId && selectedPets) {
            onAdd(selectedPetsId, selectedPets.name, selectedType);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">添加体验维度 (PETS)</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {/* Step 1: Select PETS */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            1. 选择维度
                        </label>
                        {availablePets.length === 0 ? (
                            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
                                所有维度已添加
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {availablePets.map(pets => (
                                    <button
                                        key={pets.id}
                                        onClick={() => setSelectedPetsId(pets.id)}
                                        className={`px-3 py-2.5 text-sm rounded-lg border-2 text-left transition-all ${selectedPetsId === pets.id
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {pets.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Step 2: Select Type */}
                    {selectedPetsId && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                2. 选择影响方向
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setSelectedType('enhanced')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition-all ${selectedType === 'enhanced'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <Plus size={18} />
                                    增强
                                </button>
                                <button
                                    onClick={() => setSelectedType('reduced')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition-all ${selectedType === 'reduced'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <Minus size={18} />
                                    减弱
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedPetsId}
                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        确认添加
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPetsDialog;
