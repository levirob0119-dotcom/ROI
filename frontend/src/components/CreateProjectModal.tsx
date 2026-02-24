import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';
import ProjectForm, { type ProjectFormData } from '@/components/Project/ProjectForm';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (project: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const handleSubmit = async (data: ProjectFormData) => {
        const newProject = await projectService.create(data);
        onSuccess(newProject);
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
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    submitLabel="创建"
                    defaultSelectAllVehicles
                />
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectModal;
