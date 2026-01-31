import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';
import './CreateProjectModal.css';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (project: Project) => void;
}

const AVAILABLE_VEHICLES = [
    { id: 'leo', name: 'Leo' },
    { id: 'draco', name: 'Draco' },
    { id: 'cetus', name: 'Cetus' },
    { id: 'cygnus', name: 'Cygnus' },
    { id: 'hercules', name: 'Hercules' },
    { id: 'pisces', name: 'Pisces' },
];

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleVehicleToggle = (vehicleId: string) => {
        setSelectedVehicles(prev =>
            prev.includes(vehicleId)
                ? prev.filter(id => id !== vehicleId)
                : [...prev, vehicleId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (selectedVehicles.length === 0) {
            setError('请至少选择一个车型');
            return;
        }

        setIsSubmitting(true);

        try {
            const newProject = await projectService.create({
                name,
                description,
                vehicles: selectedVehicles
            });
            onSuccess(newProject);
            onClose();
            // Reset form
            setName('');
            setDescription('');
            setSelectedVehicles([]);
        } catch (err: any) {
            setError(err.response?.data?.error || '创建方案失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">新建分析方案</h2>
                    <button onClick={onClose} className="modal-close">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">方案名称</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                                placeholder="例如：2024 Q1 智能座舱优化分析"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">描述（可选）</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-input"
                                rows={3}
                                placeholder="简要描述方案背景和目标..."
                                disabled={isSubmitting}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">关联车型</label>
                            <div className="checkbox-group">
                                {AVAILABLE_VEHICLES.map(v => (
                                    <label key={v.id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedVehicles.includes(v.id)}
                                            onChange={() => handleVehicleToggle(v.id)}
                                            disabled={isSubmitting}
                                        />
                                        <span>{v.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={isSubmitting}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>创建中...</span>
                                </>
                            ) : (
                                <span>创建方案</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
