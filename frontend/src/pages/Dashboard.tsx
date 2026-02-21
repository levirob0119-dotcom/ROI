import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Search } from 'lucide-react';

import CreateProjectModal from '@/components/CreateProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import EmptyStateBlock from '@/components/patterns/EmptyStateBlock';
import InlineStatusBar from '@/components/patterns/InlineStatusBar';
import PageHeader from '@/components/patterns/PageHeader';
import ProjectCard from '@/components/patterns/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [keyword, setKeyword] = useState('');

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

    const filteredProjects = useMemo(() => {
        const lowered = keyword.trim().toLowerCase();
        if (!lowered) return projects;
        return projects.filter((project) => {
            const vehicleMatch = project.vehicles.some((vehicle) => vehicle.toLowerCase().includes(lowered));
            return (
                project.name.toLowerCase().includes(lowered) ||
                project.description?.toLowerCase().includes(lowered) ||
                vehicleMatch
            );
        });
    }, [keyword, projects]);

    const latestUpdatedAt = useMemo(() => {
        if (!projects.length) return null;
        return [...projects].sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())[0].updatedAt;
    }, [projects]);

    const handleCreateSuccess = (newProject: Project) => {
        setProjects((prev) => [newProject, ...prev]);
        setIsCreateModalOpen(false);
    };

    const handleEditSuccess = (updatedProject: Project) => {
        setProjects((prev) => prev.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
        setEditingProject(null);
    };

    const handleDelete = async (projectId: string) => {
        if (!window.confirm('确定要删除这个方案吗？')) {
            return;
        }

        try {
            await projectService.delete(projectId);
            setProjects((prev) => prev.filter((project) => project.id !== projectId));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="项目工作台"
                description="管理你的 ROI 分析项目并快速进入同屏测算工作台。"
                meta={`共 ${projects.length} 个项目${latestUpdatedAt ? ` · 最近更新 ${new Date(latestUpdatedAt).toLocaleString()}` : ''}`}
                actions={
                    <Button type="button" variant="action" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        新建项目
                    </Button>
                }
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-control bg-white px-4 py-3 shadow-[0_12px_26px_rgba(15,23,42,0.09)]">
                    <p className="text-ds-caption text-text-secondary">项目总数</p>
                    <p className="mt-1 text-ds-title-sm text-text-primary">{projects.length}</p>
                </div>
                <div className="rounded-control bg-white px-4 py-3 shadow-[0_12px_26px_rgba(15,23,42,0.09)]">
                    <p className="text-ds-caption text-text-secondary">本次检索结果</p>
                    <p className="mt-1 text-ds-title-sm text-text-primary">{filteredProjects.length}</p>
                </div>
                <div className="rounded-control bg-white px-4 py-3 shadow-[0_12px_26px_rgba(15,23,42,0.09)]">
                    <p className="text-ds-caption text-text-secondary">默认流程</p>
                    <p className="mt-1 text-ds-title-sm text-text-primary">同屏联动</p>
                </div>
            </div>

            <div className="rounded-control bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
                <label htmlFor="project-search" className="mb-2 block text-ds-body-sm font-semibold text-text-primary">
                    快速检索项目
                </label>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <Input
                        id="project-search"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="按项目名称、描述或车型检索"
                        className="pl-9"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center rounded-control bg-white py-16 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : projects.length === 0 ? (
                <EmptyStateBlock
                    title="还没有分析项目"
                    description="先创建一个项目，配置车型和体验维度后即可开始测算。"
                    actionLabel="创建第一个项目"
                    onAction={() => setIsCreateModalOpen(true)}
                />
            ) : filteredProjects.length === 0 ? (
                <InlineStatusBar
                    tone="warning"
                    title="没有匹配到项目"
                    description="请调整检索关键词，或直接新建项目。"
                    actions={
                        <Button type="button" variant="outline" size="sm" onClick={() => setKeyword('')}>
                            清空检索
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onOpen={(id) => navigate(`/project/${id}`)}
                            onEdit={(id) => {
                                const target = projects.find((item) => item.id === id) || null;
                                setEditingProject(target);
                            }}
                            onDelete={handleDelete}
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
        </div>
    );
};

export default Dashboard;
