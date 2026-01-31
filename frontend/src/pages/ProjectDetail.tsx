import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { projectService } from '@/services/projects';
import { dataService, type Pets, type UVL1, type VehicleDataStatus } from '@/services/data';
import type { Project } from '@/types/models';
import ProjectHeader from '@/components/Project/ProjectHeader';
import AnalysisInput from '@/components/Project/AnalysisInput';
import AnalysisResult from '@/components/Project/AnalysisResult';
import EditProjectModal from '@/components/EditProjectModal';
import './ProjectDetail.css';

// 新数据模型：PETS 条目
interface PetsEntry {
    petsId: string;
    petsName: string;
    type: 'enhanced' | 'reduced';
    uvL2Names: string[];
    isExpanded: boolean;
}

// 每个车型的分析数据
interface VehicleAnalysis {
    petsEntries: PetsEntry[];
}

// 整个项目的分析数据
type ProjectAnalysisData = Record<string, VehicleAnalysis>;

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Data State
    const [project, setProject] = useState<Project | null>(null);
    const [petsList, setPetsList] = useState<Pets[]>([]);
    const [uvData, setUVData] = useState<UVL1[]>([]);
    const [vehiclesDataStatus, setVehiclesDataStatus] = useState<VehicleDataStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // UX State
    const [currentVehicle, setCurrentVehicle] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 新数据模型: 每个车型有自己的 petsEntries
    const [analysisData, setAnalysisData] = useState<ProjectAnalysisData>({});
    const [calculationResults, setCalculationResults] = useState<Record<string, any>>({});

    useEffect(() => {
        if (id) {
            initData(id);
        }
    }, [id]);

    const initData = async (projectId: string) => {
        try {
            const [projectData, petsData, uvDataResponse, vehiclesStatus] = await Promise.all([
                projectService.getById(projectId),
                dataService.getPets(),
                dataService.getUVData(),
                dataService.getVehiclesDataStatus()
            ]);

            setProject(projectData);
            setPetsList(petsData);
            setUVData(uvDataResponse);
            setVehiclesDataStatus(vehiclesStatus);

            // Initialize analysis state for each vehicle
            const initialAnalysis: ProjectAnalysisData = {};
            projectData.vehicles.forEach(v => {
                initialAnalysis[v] = { petsEntries: [] };
            });
            setAnalysisData(initialAnalysis);

            // Default select first vehicle
            if (projectData.vehicles.length > 0) {
                setCurrentVehicle(projectData.vehicles[0]);
            }
        } catch (error) {
            console.error('Failed to init project data', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 当前车型的分析数据
    const currentPetsEntries = useMemo(() => {
        return analysisData[currentVehicle]?.petsEntries || [];
    }, [analysisData, currentVehicle]);

    // 车型切换
    const handleVehicleChange = (vehicle: string) => {
        setCurrentVehicle(vehicle);
    };

    // 添加 PETS
    const handleAddPets = (petsId: string, petsName: string, type: 'enhanced' | 'reduced') => {
        setAnalysisData(prev => {
            const vehicleData = prev[currentVehicle] || { petsEntries: [] };
            return {
                ...prev,
                [currentVehicle]: {
                    ...vehicleData,
                    petsEntries: [
                        ...vehicleData.petsEntries,
                        { petsId, petsName, type, uvL2Names: [], isExpanded: true }
                    ]
                }
            };
        });
    };

    // 删除 PETS
    const handleDeletePets = (petsId: string) => {
        setAnalysisData(prev => {
            const vehicleData = prev[currentVehicle] || { petsEntries: [] };
            return {
                ...prev,
                [currentVehicle]: {
                    ...vehicleData,
                    petsEntries: vehicleData.petsEntries.filter(e => e.petsId !== petsId)
                }
            };
        });
    };

    // 展开/折叠 PETS 卡片
    const handleToggleExpand = (petsId: string) => {
        setAnalysisData(prev => {
            const vehicleData = prev[currentVehicle] || { petsEntries: [] };
            return {
                ...prev,
                [currentVehicle]: {
                    ...vehicleData,
                    petsEntries: vehicleData.petsEntries.map(e =>
                        e.petsId === petsId ? { ...e, isExpanded: !e.isExpanded } : e
                    )
                }
            };
        });
    };

    // 切换 UV 选择
    const handleToggleUV = (petsId: string, uvL2Name: string) => {
        setAnalysisData(prev => {
            const vehicleData = prev[currentVehicle] || { petsEntries: [] };
            return {
                ...prev,
                [currentVehicle]: {
                    ...vehicleData,
                    petsEntries: vehicleData.petsEntries.map(e => {
                        if (e.petsId !== petsId) return e;
                        const exists = e.uvL2Names.includes(uvL2Name);
                        return {
                            ...e,
                            uvL2Names: exists
                                ? e.uvL2Names.filter(name => name !== uvL2Name)
                                : [...e.uvL2Names, uvL2Name]
                        };
                    })
                }
            };
        });
    };

    // 将新数据模型转换为 API 格式
    const formatForAPI = (entries: PetsEntry[]) => {
        const enhancedPets = entries
            .filter(e => e.type === 'enhanced' && e.uvL2Names.length > 0)
            .map(e => ({ petsId: e.petsId, uvL2Names: e.uvL2Names }));
        const reducedPets = entries
            .filter(e => e.type === 'reduced' && e.uvL2Names.length > 0)
            .map(e => ({ petsId: e.petsId, uvL2Names: e.uvL2Names }));
        return { enhancedPets, reducedPets };
    };

    // 测算
    const handleCalculate = async () => {
        if (!currentVehicle) return;
        setIsSaving(true);
        try {
            const { enhancedPets, reducedPets } = formatForAPI(currentPetsEntries);
            const payload = {
                vehicle: currentVehicle,
                enhancedPets,
                reducedPets
            };
            const result = await dataService.calculateUVA(payload);
            setCalculationResults(prev => ({
                ...prev,
                [currentVehicle]: result
            }));
            alert(`测算完成！总分: ${result.finalScore}`);
        } catch (error) {
            console.error('Calculate failed', error);
            alert('测算失败');
        } finally {
            setIsSaving(false);
        }
    };

    // 保存
    const handleSave = async () => {
        if (!currentVehicle || !id) return;

        // 如果还没测算，先测算
        if (!calculationResults[currentVehicle]) {
            await handleCalculate();
        }

        const { enhancedPets, reducedPets } = formatForAPI(currentPetsEntries);
        const payload = {
            projectId: id,
            vehicle: currentVehicle,
            enhancedPets,
            reducedPets,
            kanoType: 'Performance',
            usageRate: 50,
            penetrationRate: 30,
            result: calculationResults[currentVehicle] || {}
        };

        try {
            await dataService.saveAnalysis(payload);
            alert('保存成功！');
        } catch (error) {
            console.error('Save failed', error);
        }
    };

    const handleEditSuccess = (updatedProject: Project) => {
        setProject(updatedProject);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="project-detail-page bg-gray-50 flex flex-col h-screen overflow-hidden">
            {/* T 区: 顶部 - 方案信息 + 当前车型展示 */}
            <ProjectHeader
                project={project}
                currentVehicle={currentVehicle}
                isSaving={isSaving}
                onEdit={() => setIsEditModalOpen(true)}
                onSave={handleSave}
                onCalculate={handleCalculate}
            />

            {/* 主区域: L + R */}
            <div className="detail-content">
                {/* L 区: 录入 */}
                <div className="sidebar">
                    <AnalysisInput
                        petsList={petsList}
                        uvData={uvData}
                        vehicles={project.vehicles}
                        vehiclesDataStatus={vehiclesDataStatus}
                        currentVehicle={currentVehicle}
                        petsEntries={currentPetsEntries}
                        onVehicleChange={handleVehicleChange}
                        onAddPets={handleAddPets}
                        onDeletePets={handleDeletePets}
                        onToggleExpand={handleToggleExpand}
                        onToggleUV={handleToggleUV}
                    />
                </div>

                {/* R 区: 结果 */}
                <div className="main-area">
                    <AnalysisResult
                        vehicles={project.vehicles}
                        currentVehicle={currentVehicle}
                        results={calculationResults}
                    />
                </div>
            </div>

            <EditProjectModal
                isOpen={isEditModalOpen}
                project={project}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
};

export default ProjectDetail;
