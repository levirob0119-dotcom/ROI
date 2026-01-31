import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, Calendar, Trash2, Edit3 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CreateProjectModal from '@/components/CreateProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectService.getAll();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSuccess = (newProject: Project) => {
        setProjects([newProject, ...projects]);
        // Experience Optimization 1: Auto-navigate to detail page
        navigate(`/project/${newProject.id}`);
    };

    const handleEditSuccess = (updatedProject: Project) => {
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        if (!confirm('确定要删除这个方案吗？此操作不可恢复。')) return;

        try {
            await projectService.delete(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (error) {
            console.error('Failed to delete project', error);
            alert('删除失败，请重试');
        }
    };

    const handleEditProject = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setEditingProject(project);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-container">
                <header className="dashboard-header">
                    <div className="dashboard-header-left">
                        <h1>我的方案</h1>
                        <p>创建和管理您的 ROI 分析方案</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={16} />
                        <span>新建方案</span>
                    </button>
                </header>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FolderKanban size={28} />
                        </div>
                        <h3 className="empty-title">还没有任何方案</h3>
                        <p className="empty-desc">
                            创建您的第一个 ROI 分析方案，开始评估用户价值提升
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus size={16} />
                            <span>创建方案</span>
                        </button>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="project-card"
                                onClick={() => navigate(`/project/${project.id}`)}
                            >
                                <div className="project-card-header">
                                    <h3 className="project-name">{project.name}</h3>
                                    <div className="project-actions">
                                        <button
                                            className="btn-ghost"
                                            title="编辑"
                                            onClick={(e) => handleEditProject(e, project)}
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            className="btn-ghost"
                                            title="删除"
                                            onClick={(e) => handleDeleteProject(e, project.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <p className="project-desc">
                                    {project.description || '暂无描述'}
                                </p>

                                <div className="project-footer">
                                    <div className="project-tags">
                                        {project.vehicles.slice(0, 4).map(v => (
                                            <span key={v} className="tag-vehicle">
                                                {v.toUpperCase()}
                                            </span>
                                        ))}
                                        {project.vehicles.length > 4 && (
                                            <span className="tag-vehicle">+{project.vehicles.length - 4}</span>
                                        )}
                                    </div>
                                    <div className="project-date">
                                        <Calendar size={12} />
                                        <span>{formatDate(project.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditProjectModal
                isOpen={!!editingProject}
                project={editingProject}
                onClose={() => setEditingProject(null)}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
};

export default Dashboard;
