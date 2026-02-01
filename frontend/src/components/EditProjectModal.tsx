import React from 'react';
import { X } from 'lucide-react';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';
import { Button } from '@/components/ui/button';
import ProjectForm, { type ProjectFormData } from '@/components/Project/ProjectForm';

interface EditProjectModalProps {
    isOpen: boolean;
    project: Project | null;
    onClose: () => void;
    onSuccess: (project: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, project, onClose, onSuccess }) => {
    if (!isOpen || !project) return null;

    const handleSubmit = async (data: ProjectFormData) => {
        const updatedProject = await projectService.update(project.id, data);
        onSuccess(updatedProject);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">编辑项目</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                </div>

                <ProjectForm
                    initialData={{
                        name: project.name,
                        description: project.description || '',
                        vehicles: project.vehicles
                    }}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    submitLabel="保存更改"
                />
            </div>
        </div>
    );
};

export default EditProjectModal;
