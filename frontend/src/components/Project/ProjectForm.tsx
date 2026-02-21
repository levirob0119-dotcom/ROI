import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
// import type { Project } from '@/types/models'; // Unused


export interface ProjectFormData {
    name: string;
    description: string;
    vehicles: string[];
}

interface ProjectFormProps {
    initialData?: Partial<ProjectFormData>;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    onCancel: () => void;
    submitLabel: string;
    isSubmitting?: boolean;
}

const AVAILABLE_VEHICLES = [
    { id: 'leo', name: 'Leo' },
    { id: 'draco', name: 'Draco' },
    { id: 'cetus', name: 'Cetus' },
    { id: 'cygnus', name: 'Cygnus' },
    { id: 'hercules', name: 'Hercules' },
    { id: 'pisces', name: 'Pisces' },
];

const ProjectForm: React.FC<ProjectFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    submitLabel,
    isSubmitting: externalIsSubmitting = false
}) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [selectedVehicles, setSelectedVehicles] = useState<string[]>(initialData?.vehicles || []);
    const [error, setError] = useState('');
    const [isInternalSubmitting, setIsInternalSubmitting] = useState(false);

    const isSubmitting = externalIsSubmitting || isInternalSubmitting;

    // Update state when initialData changes
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setSelectedVehicles(initialData.vehicles || []);
        }
    }, [initialData]);

    const handleVehicleToggle = (vehicleId: string) => {
        setSelectedVehicles(prev =>
            prev.includes(vehicleId)
                ? prev.filter(id => id !== vehicleId)
                : [...prev, vehicleId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (selectedVehicles.length === 0) {
            setError('请至少选择一个车型。');
            return;
        }

        setIsInternalSubmitting(true);

        try {
            await onSubmit({
                name,
                description,
                vehicles: selectedVehicles
            });
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || '操作失败');
        } finally {
            setIsInternalSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md ring-1 ring-red-200/70 shadow-[0_6px_16px_rgba(220,38,38,0.12)]">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">项目名称</label>
                    <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="例如：2024 Q1 智能座舱优化"
                        disabled={isSubmitting}
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">描述 (可选)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex min-h-[92px] w-full rounded-lg bg-white px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35),0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-slate-400 transition-all focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(19,127,236,0.45),0_8px_20px_rgba(19,127,236,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="简要描述背景和目标..."
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">关联车型</label>
                    <div className="grid grid-cols-2 gap-3">
                        {AVAILABLE_VEHICLES.map(v => (
                            <label
                                key={v.id}
                                className={cn(
                                    "flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all ring-1",
                                    selectedVehicles.includes(v.id)
                                        ? "bg-blue-50/90 text-primary ring-primary/35 shadow-[0_10px_22px_rgba(19,127,236,0.14)]"
                                        : "bg-white text-slate-700 ring-slate-900/8 hover:bg-slate-50 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)]"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={selectedVehicles.includes(v.id)}
                                    onChange={() => handleVehicleToggle(v.id)}
                                    disabled={isSubmitting}
                                />
                                <div className={cn(
                                    "w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ring-1",
                                    selectedVehicles.includes(v.id)
                                        ? "bg-primary ring-primary"
                                        : "bg-white ring-slate-300"
                                )}>
                                    {selectedVehicles.includes(v.id) && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{v.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50/70">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    取消
                </Button>
                <Button type="submit" variant="action" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            处理中...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ProjectForm;
