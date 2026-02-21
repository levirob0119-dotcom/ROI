import React from 'react';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/42 backdrop-blur-[6px] animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-md overflow-hidden rounded-card border border-slate-200/80 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.14)] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <ProjectForm
                    initialData={{
                        name: project.name,
                        description: project.description || '',
                        vehicles: project.vehicles
                    }}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    submitLabel="保存"
                />
            </div>
        </div>
    );
};

export default EditProjectModal;
