import React, { useMemo, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <DialogTitle>添加体验维度 (Pets)</DialogTitle>
                            <DialogDescription>为当前车型新增提升或降低体验维度。</DialogDescription>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="关闭">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-5 px-6 pb-6">
                    <div className="space-y-2">
                        <p className="text-ds-body-sm font-semibold text-text-primary">1. 选择维度</p>
                        {availablePets.length === 0 ? (
                            <div className="surface-inset rounded-control px-3 py-4 text-ds-body-sm text-text-secondary">
                                全部维度已添加。
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {availablePets.map((pets) => {
                                    const active = selectedPetsId === pets.id;
                                    return (
                                        <Button
                                            key={pets.id}
                                            type="button"
                                            variant="outline"
                                            onClick={() => setSelectedPetsId(pets.id)}
                                            className={cn(
                                                'h-auto justify-start px-3 py-2 text-left text-ds-body-sm transition-colors',
                                                active
                                                    ? 'surface-tint-info text-info shadow-[inset_0_0_0_2px_rgba(14,165,233,0.28)]'
                                                    : 'surface-inset text-text-primary hover:bg-slate-100'
                                            )}
                                        >
                                            {pets.name}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-ds-body-sm font-semibold text-text-primary">2. 选择影响方向</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedType('enhanced')}
                                className={cn(
                                    'h-auto gap-2 px-3 py-2 text-ds-body-sm font-medium transition-colors',
                                    selectedType === 'enhanced'
                                        ? 'surface-tint-success text-success shadow-[inset_0_0_0_2px_rgba(22,163,74,0.28)]'
                                        : 'surface-inset text-text-secondary hover:bg-slate-100'
                                )}
                            >
                                <Plus className="h-4 w-4" />
                                提升
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedType('reduced')}
                                className={cn(
                                    'h-auto gap-2 px-3 py-2 text-ds-body-sm font-medium transition-colors',
                                    selectedType === 'reduced'
                                        ? 'surface-tint-error text-error shadow-[inset_0_0_0_2px_rgba(220,38,38,0.28)]'
                                        : 'surface-inset text-text-secondary hover:bg-slate-100'
                                )}
                            >
                                <Minus className="h-4 w-4" />
                                降低
                            </Button>
                        </div>
                    </div>

                    {selectedPets ? (
                        <div className="surface-inset rounded-control px-3 py-2">
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddPetsDialog;
