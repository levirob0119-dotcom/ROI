import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
    if (!project) return null;

    const handleSubmit = async (data: ProjectFormData) => {
        const updatedProject = await projectService.update(project.id, data);
        onSuccess(updatedProject);
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-w-md overflow-hidden p-0">
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
            </DialogContent>
        </Dialog>
    );
};

export default EditProjectModal;
