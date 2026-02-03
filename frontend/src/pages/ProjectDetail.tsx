import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Plus, Calculator, Save, Settings } from 'lucide-react';
import { projectService } from '@/services/projects';
import { dataService, type Pets, type UVL1, type VehicleDataStatus } from '@/services/data';
import type { Project } from '@/types/models';
import type { ProjectAnalysisData } from '@/types/analysis';
import PetsEntryCard from '@/components/Project/PetsEntryCard';
import AddPetsDialog from '@/components/Project/AddPetsDialog';
import VehicleResultPanel from '@/components/Project/VehicleResultPanel';
import EditProjectModal from '@/components/EditProjectModal';
import { Slider } from '@/components/ui/slider';
import { RadioGroup } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/toast';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Data State
    const [project, setProject] = useState<Project | null>(null);
    const [petsList, setPetsList] = useState<Pets[]>([]);
    const [uvData, setUVData] = useState<UVL1[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);

    // Analysis State (new structure)
    const [analysisData, setAnalysisData] = useState<ProjectAnalysisData>({});
    const [calculationResults, setCalculationResults] = useState<Record<string, any>>({});

    // UX State
    const [currentVehicle, setCurrentVehicle] = useState<string>('');
    const [isAddPetsOpen, setIsAddPetsOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [vehicleDataStatus, setVehicleDataStatus] = useState<VehicleDataStatus[]>([]);
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        if (id) {
            initData(id);
        }
    }, [id]);

    const initData = async (projectId: string) => {
        try {
            const [projectData, petsData, uvDataResponse, vehicleStatus] = await Promise.all([
                projectService.getById(projectId),
                dataService.getPets(),
                dataService.getUVData(),
                dataService.getVehiclesDataStatus()
            ]);

            setProject(projectData);
            setPetsList(petsData);
            setUVData(uvDataResponse);
            setVehicleDataStatus(vehicleStatus);

            // Initialize analysis state for each vehicle
            const initialAnalysis: ProjectAnalysisData = {};
            projectData.vehicles.forEach(v => {
                initialAnalysis[v] = { petsEntries: [] };
            });
            setAnalysisData(initialAnalysis);

            // Default select first vehicle that has data
            const firstVehicleWithData = projectData.vehicles.find(v => {
                const status = vehicleStatus.find(s => s.id.toLowerCase() === v.toLowerCase());
                return status?.hasData !== false;
            }) || projectData.vehicles[0];

            if (firstVehicleWithData) {
                setCurrentVehicle(firstVehicleWithData);
            }
        } catch (error) {
            console.error('Failed to init project data', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Check if a vehicle has UVA data
    const vehicleHasData = (vehicleId: string): boolean => {
        const status = vehicleDataStatus.find(s => s.id.toLowerCase() === vehicleId.toLowerCase());
        return status?.hasData !== false;
    };

    // Current vehicle's analysis data
    const currentAnalysis = useMemo(() => {
        return analysisData[currentVehicle] || { petsEntries: [] };
    }, [analysisData, currentVehicle]);

    // Existing PETS IDs for current vehicle
    const existingPetsIds = useMemo(() => {
        return currentAnalysis.petsEntries.map(e => e.petsId);
    }, [currentAnalysis]);

    // Handlers
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

    const handleUpdateConfig = (field: 'kanoType' | 'usageRate' | 'penetrationRate', value: any) => {
        setAnalysisData(prev => {
            const vehicleData = prev[currentVehicle] || { petsEntries: [] };
            return {
                ...prev,
                [currentVehicle]: {
                    ...vehicleData,
                    [field]: value
                }
            };
        });
    };

    const handleCalculate = async () => {
        if (!currentVehicle) return;

        setIsCalculating(true);
        try {
            // Build API payload from petsEntries
            const entries = currentAnalysis.petsEntries;
            const enhancedPets = entries
                .filter(e => e.type === 'enhanced' && e.uvL2Names.length > 0)
                .map(e => ({ petsId: e.petsId, petsName: e.petsName, uvL2Names: e.uvL2Names }));
            const reducedPets = entries
                .filter(e => e.type === 'reduced' && e.uvL2Names.length > 0)
                .map(e => ({ petsId: e.petsId, petsName: e.petsName, uvL2Names: e.uvL2Names }));

            const result = await dataService.calculateUVA({
                vehicle: currentVehicle,
                enhancedPets,
                reducedPets,
                kanoType: currentAnalysis.kanoType,
                usageRate: currentAnalysis.usageRate,
                penetrationRate: currentAnalysis.penetrationRate
            });

            setCalculationResults(prev => ({
                ...prev,
                [currentVehicle]: result
            }));
        } catch (error) {
            console.error('Calculate failed', error);
        } finally {
            setIsCalculating(false);
        }
    };

    const handleEditSuccess = (updatedProject: Project) => {
        setProject(updatedProject);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* T 区: 顶部 - 方案信息 + 车型选择 */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* 左侧: 方案信息 */}
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{project.description || '暂无描述'}</p>
                    </div>

                    {/* 中间: 车型 Tabs */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        {project.vehicles.map(v => {
                            const hasData = vehicleHasData(v);
                            return (
                                <button
                                    key={v}
                                    onClick={() => {
                                        if (hasData) {
                                            setCurrentVehicle(v);
                                        } else {
                                            showToast('当前车型暂无数据', 'warning');
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentVehicle === v
                                        ? 'bg-white text-indigo-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {v.toUpperCase()}
                                </button>
                            );
                        })}
                    </div>

                    {/* 右侧: 操作按钮 */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={handleCalculate}
                            disabled={isCalculating}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            <Calculator size={16} />
                            {isCalculating ? '计算中...' : '测算'}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                            <Save size={16} />
                            保存
                        </button>
                    </div>
                </div>
            </header>

            {/* 主区域: L + R */}
            <div className="flex-1 flex min-h-0">
                {/* L 区: 录入区 */}
                <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                体验维度录入 · {currentVehicle.toUpperCase()}
                            </h2>
                            <button
                                onClick={() => setIsAddPetsOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={16} />
                                添加 PETS
                            </button>
                        </div>

                        {/* PETS Entry Cards */}
                        {currentAnalysis.petsEntries.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
                                <p className="text-gray-500 mb-4">暂无录入数据</p>
                                <button
                                    onClick={() => setIsAddPetsOpen(true)}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    点击添加第一个体验维度
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentAnalysis.petsEntries.map(entry => (
                                    <PetsEntryCard
                                        key={entry.petsId}
                                        entry={entry}
                                        uvData={uvData}
                                        onToggleExpand={() => handleToggleExpand(entry.petsId)}
                                        onDelete={() => handleDeletePets(entry.petsId)}
                                        onToggleUV={(uvName) => handleToggleUV(entry.petsId, uvName)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Kano & Frequency Configuration */}
                        {currentAnalysis.petsEntries.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <h3 className="text-sm font-semibold text-foreground mb-4">附加配置</h3>
                                <div className="space-y-6">
                                    {/* Kano Type */}
                                    <div>
                                        <label className="text-xs text-muted-foreground block mb-3 font-medium">Kano 需求属性</label>
                                        <RadioGroup
                                            name={`kano-${currentVehicle}`}
                                            value={currentAnalysis.kanoType}
                                            onChange={(value) => handleUpdateConfig('kanoType', value)}
                                            options={[
                                                { value: 'must-be', label: '必备型' },
                                                { value: 'performance', label: '期望型' },
                                                { value: 'attractive', label: '魅力型' }
                                            ]}
                                        />
                                    </div>

                                    {/* Frequency Sliders */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-card rounded-xl border border-border p-4">
                                            <label className="text-xs text-muted-foreground font-medium block mb-4">
                                                使用率
                                                <span className="font-normal text-muted-foreground/60 ml-2">该功能在对应车型上一定周期内的使用概率</span>
                                            </label>
                                            <Slider
                                                value={currentAnalysis.usageRate || 0}
                                                min={0}
                                                max={100}
                                                unit="%"
                                                onChange={(value) => handleUpdateConfig('usageRate', value)}
                                            />
                                        </div>
                                        <div className="bg-card rounded-xl border border-border p-4">
                                            <label className="text-xs text-muted-foreground font-medium block mb-4">
                                                渗透率
                                                <span className="font-normal text-muted-foreground/60 ml-2">激活并使用过该功能的车辆占比「全生命周期，一次就算」</span>
                                            </label>
                                            <Slider
                                                value={currentAnalysis.penetrationRate || 0}
                                                min={0}
                                                max={100}
                                                unit="%"
                                                onChange={(value) => handleUpdateConfig('penetrationRate', value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* R 区: 结果区 */}
                <div className="w-1/2 bg-gray-50 overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">UVA 测算结果</h2>

                        <div className="space-y-4">
                            {project.vehicles.map(v => (
                                <VehicleResultPanel
                                    key={v}
                                    vehicle={v}
                                    result={calculationResults[v]}
                                    config={analysisData[v]}
                                    isActive={currentVehicle === v}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            {isAddPetsOpen && (
                <AddPetsDialog
                    petsList={petsList}
                    existingPetsIds={existingPetsIds}
                    onAdd={handleAddPets}
                    onClose={() => setIsAddPetsOpen(false)}
                />
            )}

            <EditProjectModal
                isOpen={isEditModalOpen}
                project={project}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
            />

            {/* Toast Notifications */}
            <ToastComponent />
        </div>
    );
};

export default ProjectDetail;
