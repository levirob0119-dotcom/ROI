import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, Calculator, Loader2, Car } from 'lucide-react';
import type { Project } from '@/types/models';

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
        <header className="detail-header">
            <div className="header-inner">
                <div className="header-top-row">
                    <div className="header-left">
                        <button
                            onClick={() => navigate('/')}
                            className="back-btn"
                            title="返回列表"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="project-title-area">
                            <h1>
                                {project.name}
                                <button
                                    onClick={onEdit}
                                    className="btn-ghost"
                                    title="编辑方案信息"
                                    style={{ padding: '4px' }}
                                >
                                    <Edit3 size={14} />
                                </button>
                            </h1>
                            <p className="project-subtitle">
                                {project.description || '暂无描述'}
                            </p>
                        </div>
                    </div>

                    {/* 中间：当前车型显示 (只读) */}
                    <div className="current-vehicle-display">
                        <Car size={14} />
                        <span>当前车型: {currentVehicle.toUpperCase()}</span>
                    </div>

                    <div className="header-right">
                        <button
                            className="btn-secondary"
                            onClick={onCalculate}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Calculator size={16} />}
                            <span>测算</span>
                        </button>
                        <button
                            className="btn-primary"
                            onClick={onSave}
                            disabled={isSaving}
                        >
                            <Save size={16} />
                            <span>保存</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProjectHeader;
