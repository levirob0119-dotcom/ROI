import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, Loader2 } from 'lucide-react';

import CreateProjectModal from '@/components/CreateProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import EmptyStateBlock from '@/components/patterns/EmptyStateBlock';
import ProjectCard from '@/components/patterns/ProjectCard';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        const openCreateModal = () => setIsCreateModalOpen(true);
        window.addEventListener('dashboard:create-project', openCreateModal);

        return () => {
            window.removeEventListener('dashboard:create-project', openCreateModal);
        };
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectService.getAll();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSuccess = (newProject: Project) => {
        setProjects((prev) => [newProject, ...prev]);
        setIsCreateModalOpen(false);
        window.dispatchEvent(new Event('projects:changed'));
    };

    const handleEditSuccess = (updatedProject: Project) => {
        setProjects((prev) => prev.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
        setEditingProject(null);
        window.dispatchEvent(new Event('projects:changed'));
    };

    const handleDelete = async (projectId: string) => {
        try {
            await projectService.delete(projectId);
            setProjects((prev) => prev.filter((project) => project.id !== projectId));
            window.dispatchEvent(new Event('projects:changed'));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
            {isLoading ? (
                <div className="flex items-center justify-center rounded-control bg-white py-16 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : projects.length === 0 ? (
                <EmptyStateBlock
                    icon={FolderPlus}
                    iconStrokeWidth={1.7}
                    iconClassName="h-8 w-8 text-slate-600"
                    iconWrapperClassName="bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.1)]"
                    actionLabel="创建"
                    onAction={() => setIsCreateModalOpen(true)}
                    actionVariant="action"
                    actionSize="lg"
                    actionClassName="min-w-[220px] text-base"
                    containerClassName="bg-slate-50 shadow-none justify-center min-h-[calc(100vh-220px)] gap-8"
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onOpen={(id) => navigate(`/workspace/${id}/uva`)}
                            onEdit={(id) => {
                                const target = projects.find((item) => item.id === id) || null;
                                setEditingProject(target);
                            }}
                            onDelete={(id) => setDeletingProjectId(id)}
                        />
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editingProject ? (
                <EditProjectModal
                    isOpen
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSuccess={handleEditSuccess}
                />
            ) : null}

            <ConfirmDialog
                open={deletingProjectId !== null}
                onOpenChange={(open) => {
                    if (!open) setDeletingProjectId(null);
                }}
                title="删除项目"
                description="删除后不可恢复，是否继续删除该项目？"
                confirmLabel="确认删除"
                onConfirm={() => {
                    if (!deletingProjectId) return;
                    void handleDelete(deletingProjectId);
                }}
            />
        </div>
    );
};

export default Dashboard;
