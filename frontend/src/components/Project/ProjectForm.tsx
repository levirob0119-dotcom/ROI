import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    defaultSelectAllVehicles?: boolean;
}

const AVAILABLE_VEHICLES = [
    { id: 'leo', name: 'Leo' },
    { id: 'draco', name: 'Draco' },
    { id: 'cetus', name: 'Cetus' },
    { id: 'cygnus', name: 'Cygnus' },
    { id: 'hercules', name: 'Hercules' },
    { id: 'pisces', name: 'Pisces' },
];
const ALL_VEHICLE_IDS = AVAILABLE_VEHICLES.map((vehicle) => vehicle.id);

const ProjectForm: React.FC<ProjectFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    submitLabel,
    isSubmitting: externalIsSubmitting = false,
    defaultSelectAllVehicles = false
}) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [selectedVehicles, setSelectedVehicles] = useState<string[]>(
        initialData?.vehicles || (defaultSelectAllVehicles ? ALL_VEHICLE_IDS : [])
    );
    const [errorField, setErrorField] = useState<'name' | 'vehicles' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isInternalSubmitting, setIsInternalSubmitting] = useState(false);

    const isSubmitting = externalIsSubmitting || isInternalSubmitting;
    const nameHasError = errorField === 'name';
    const vehiclesHasError = errorField === 'vehicles';
    const namePlaceholder = nameHasError ? errorMessage : '例如：2026Q1 满意度优化';
    const fieldSurfaceClassName = cn(
        'h-12 rounded-control border-0 bg-slate-100/90 px-4 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:shadow-[inset_0_0_0_2px_rgba(59,130,246,0.32)]',
        nameHasError && 'text-red-600 placeholder:text-red-500 focus-visible:shadow-[inset_0_0_0_2px_rgba(220,38,38,0.28)]'
    );

    // Update state when initialData changes
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setSelectedVehicles(initialData.vehicles || []);
        } else if (defaultSelectAllVehicles) {
            setSelectedVehicles(ALL_VEHICLE_IDS);
        }
    }, [defaultSelectAllVehicles, initialData]);

    const handleVehicleToggle = (vehicleId: string) => {
        setSelectedVehicles(prev =>
            prev.includes(vehicleId)
                ? prev.filter(id => id !== vehicleId)
                : [...prev, vehicleId]
        );
    };

    const handleToggleAllVehicles = () => {
        setSelectedVehicles((previous) =>
            previous.length === ALL_VEHICLE_IDS.length ? [] : ALL_VEHICLE_IDS
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorField(null);
        setErrorMessage('');

        const cleanName = name.trim();

        if (!cleanName) {
            setErrorField('name');
            setErrorMessage('请输入项目名称');
            return;
        }

        if (selectedVehicles.length === 0) {
            setErrorField('vehicles');
            setErrorMessage('请至少选择一个车型');
            return;
        }

        setIsInternalSubmitting(true);

        try {
            await onSubmit({
                name: cleanName,
                description: description.trim(),
                vehicles: selectedVehicles
            });
        } catch (err: unknown) {
            const responseMessage =
                typeof err === 'object' &&
                    err !== null &&
                    'response' in err &&
                    typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
                    ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
                    : undefined;
            const message =
                responseMessage ??
                (err instanceof Error
                    ? err.message
                    : '操作失败');
            setErrorField('name');
            setErrorMessage(message);
        } finally {
            setIsInternalSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">项目名称</Label>
                    <Input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (errorField === 'name') {
                                setErrorField(null);
                                setErrorMessage('');
                            }
                        }}
                        placeholder={namePlaceholder}
                        disabled={isSubmitting}
                        autoFocus
                        className={fieldSurfaceClassName}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">描述 (可选)</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-24 resize-none border-0 bg-slate-100/90 px-4 py-3 text-base text-slate-900 shadow-none focus-visible:bg-white focus-visible:shadow-[inset_0_0_0_2px_rgba(59,130,246,0.32)]"
                        placeholder="简要描述背景和目标..."
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-slate-700">车型</Label>
                            {vehiclesHasError ? <span className="text-xs text-red-600">{errorMessage}</span> : null}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                                已选 {selectedVehicles.length}/{ALL_VEHICLE_IDS.length}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 bg-slate-100 text-xs text-slate-700 hover:bg-slate-200"
                                onClick={handleToggleAllVehicles}
                                disabled={isSubmitting}
                            >
                                {selectedVehicles.length === ALL_VEHICLE_IDS.length ? '全不选' : '全选'}
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {AVAILABLE_VEHICLES.map(v => (
                            <Button
                                key={v.id}
                                type="button"
                                onClick={() => handleVehicleToggle(v.id)}
                                disabled={isSubmitting}
                                aria-pressed={selectedVehicles.includes(v.id)}
                                variant={selectedVehicles.includes(v.id) ? 'action' : 'outline'}
                                className={cn(
                                    'flex h-auto items-center justify-start px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                                    selectedVehicles.includes(v.id)
                                        ? 'bg-blue-100/90 text-slate-900 hover:bg-blue-100'
                                        : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80'
                                )}
                            >
                                <span className="text-ds-body font-medium leading-none">{v.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full bg-slate-300/70 text-slate-800 hover:bg-slate-300 text-base font-medium shadow-none hover:shadow-none"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    取消
                </Button>
                <Button
                    type="submit"
                    variant="action"
                    size="lg"
                    className="w-full text-base font-semibold shadow-none hover:shadow-none"
                    disabled={isSubmitting}
                >
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
