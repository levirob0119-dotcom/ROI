import React, { useMemo, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Pets } from '@/services/data';
import { cn } from '@/lib/utils';

interface AddPetsDialogProps {
    petsList: Pets[];
    existingPetsIds: string[];
    onAdd: (petsId: string, petsName: string, type: 'enhanced' | 'reduced') => void;
    onClose: () => void;
}

const AddPetsDialog: React.FC<AddPetsDialogProps> = ({ petsList, existingPetsIds, onAdd, onClose }) => {
    const [selectedPetsId, setSelectedPetsId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'enhanced' | 'reduced'>('enhanced');

    const availablePets = useMemo(
        () => petsList.filter((pets) => !existingPetsIds.includes(pets.id)),
        [petsList, existingPetsIds]
    );

    const selectedPets = useMemo(
        () => petsList.find((pets) => pets.id === selectedPetsId),
        [petsList, selectedPetsId]
    );

    const handleConfirm = () => {
        if (selectedPetsId && selectedPets) {
            onAdd(selectedPetsId, selectedPets.name, selectedType);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 backdrop-blur-sm" onClick={onClose}>
            <Card className="w-full max-w-xl hover:translate-y-0" onClick={(event) => event.stopPropagation()}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                        <CardTitle>添加体验维度 (PETS)</CardTitle>
                        <p className="mt-1 text-ds-body-sm text-text-secondary">为当前车型新增提升或降低体验维度。</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="关闭">
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <p className="text-ds-body-sm font-semibold text-text-primary">1. 选择维度</p>
                        {availablePets.length === 0 ? (
                            <div className="rounded-control bg-surface px-3 py-4 text-ds-body-sm text-text-secondary ring-1 ring-slate-900/8">
                                全部维度已添加。
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {availablePets.map((pets) => {
                                    const active = selectedPetsId === pets.id;
                                    return (
                                        <button
                                            key={pets.id}
                                            type="button"
                                            onClick={() => setSelectedPetsId(pets.id)}
                                            className={cn(
                                                'rounded-control px-3 py-2 text-left text-ds-body-sm transition-all ring-1',
                                                active
                                                    ? 'bg-primary/10 text-primary ring-primary/35 shadow-[0_8px_18px_rgba(19,127,236,0.14)]'
                                                    : 'bg-white text-text-primary ring-slate-900/10 hover:ring-primary/25 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)]'
                                            )}
                                        >
                                            {pets.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-ds-body-sm font-semibold text-text-primary">2. 选择影响方向</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedType('enhanced')}
                                className={cn(
                                    'inline-flex items-center justify-center gap-2 rounded-control px-3 py-2 text-ds-body-sm font-medium transition-all ring-1',
                                    selectedType === 'enhanced'
                                        ? 'bg-success/10 text-success ring-success/35 shadow-[0_8px_18px_rgba(22,163,74,0.14)]'
                                        : 'bg-white text-text-secondary ring-slate-900/10 hover:ring-success/25'
                                )}
                            >
                                <Plus className="h-4 w-4" />
                                提升
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedType('reduced')}
                                className={cn(
                                    'inline-flex items-center justify-center gap-2 rounded-control px-3 py-2 text-ds-body-sm font-medium transition-all ring-1',
                                    selectedType === 'reduced'
                                        ? 'bg-error/10 text-error ring-error/35 shadow-[0_8px_18px_rgba(220,38,38,0.14)]'
                                        : 'bg-white text-text-secondary ring-slate-900/10 hover:ring-error/25'
                                )}
                            >
                                <Minus className="h-4 w-4" />
                                降低
                            </button>
                        </div>
                    </div>

                    {selectedPets ? (
                        <div className="rounded-control bg-surface px-3 py-2 ring-1 ring-slate-900/8">
                            <p className="text-ds-caption text-text-secondary">即将添加</p>
                            <p className="mt-1 text-ds-body-sm text-text-primary">
                                {selectedPets.name}
                                <Badge variant={selectedType === 'enhanced' ? 'success' : 'destructive'} className="ml-2">
                                    {selectedType === 'enhanced' ? '提升' : '降低'}
                                </Badge>
                            </p>
                        </div>
                    ) : null}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            取消
                        </Button>
                        <Button type="button" variant="action" disabled={!selectedPetsId} onClick={handleConfirm}>
                            确认添加
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddPetsDialog;
