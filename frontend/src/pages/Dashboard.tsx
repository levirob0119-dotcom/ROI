import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Clock, Box } from 'lucide-react';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';
import CreateProjectModal from '@/components/CreateProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
        loadProjects();
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
        setProjects(prev => [newProject, ...prev]);
        setIsCreateModalOpen(false);
    };

    const handleEditSuccess = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setEditingProject(null);
    };

    const handleDelete = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        if (window.confirm('确定要删除这个方案吗？')) {
            try {
                await projectService.delete(projectId);
                setProjects(prev => prev.filter(p => p.id !== projectId));
            } catch (error) {
                console.error('Delete failed', error);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-2 text-base">Manage your analysis projects and reports.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : projects.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-slate-200 border-dashed">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Box className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
                    <p className="text-slate-500 mt-2 mb-6 max-w-sm text-center">
                        Get started by creating a new analysis project to evaluate vehicle features.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                    </Button>
                </div>
            ) : (
                /* Projects Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="group bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                                    {project.name}
                                </h3>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={(e) => handleDelete(e, project.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-blue-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingProject(project);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                    </Button>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">
                                {project.description || "No description provided."}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6 h-14 overflow-hidden content-start">
                                {project.vehicles.map(v => (
                                    <span key={v} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {v}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <div className="flex items-center text-xs text-slate-400">
                                    <Clock className="mr-1 h-3.5 w-3.5" />
                                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-4px] group-hover:translate-x-0 duration-300">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editingProject && (
                <EditProjectModal
                    isOpen={true}
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default Dashboard;
