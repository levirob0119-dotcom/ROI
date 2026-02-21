import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, Calculator, Loader2, Car } from 'lucide-react';
import type { Project } from '@/types/models';
import { Button } from '@/components/ui/button';
import { formatEnglishLabel } from '@/lib/utils';

interface ProjectHeaderProps {
    project: Project;
    currentVehicle: string;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCalculate: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    project,
    currentVehicle,
    isSaving,
    onEdit,
    onSave,
    onCalculate
}) => {
    const navigate = useNavigate();

    return (
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 sticky top-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/')}
                        title="Back to Dashboard"
                        className="h-9 w-9 text-slate-500"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                {project.name}
                            </h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onEdit}
                                className="h-6 w-6 text-slate-400 hover:text-primary"
                                title="Edit Project Details"
                            >
                                <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {project.description || 'No description provided'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    {/* Read-only vehicle display */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                        <Car className="h-4 w-4 text-slate-500" />
                        <span>Vehicle: {formatEnglishLabel(currentVehicle)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={onCalculate}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Calculator className="h-4 w-4" />}
                            Calculate
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProjectHeader;
