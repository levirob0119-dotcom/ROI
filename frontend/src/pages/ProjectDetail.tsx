import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calculator, Loader2, Plus, Save, Settings } from 'lucide-react';

import EditProjectModal from '@/components/EditProjectModal';
import AddPetsDialog from '@/components/Project/AddPetsDialog';
import PetsEntryCard from '@/components/Project/PetsEntryCard';
import VehicleResultPanel from '@/components/Project/VehicleResultPanel';
import EmptyStateBlock from '@/components/patterns/EmptyStateBlock';
import InlineStatusBar from '@/components/patterns/InlineStatusBar';
import PageHeader from '@/components/patterns/PageHeader';
import VehicleTabs from '@/components/patterns/VehicleTabs';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { cn, formatEnglishLabel } from '@/lib/utils';
import { projectService } from '@/services/projects';
import {
    dataService,
    type CalculateUvaResponse,
    type Pets,
    type ProjectAnalysisRecord,
    type SelectedPetsPayload,
    type UVL1,
    type VehicleDataStatus
} from '@/services/data';
import type { Project } from '@/types/models';
import type { AnalysisValidationState, ProjectAnalysisData, VehicleAnalysis } from '@/types/analysis';

function buildValidationState(analysis: VehicleAnalysis, hasVehicleData: boolean): AnalysisValidationState {
    const selectedPetsCount = analysis.petsEntries.length;
    const selectedUvCount = analysis.petsEntries.reduce((count, entry) => count + entry.uvL2Names.length, 0);
    const blockers: string[] = [];

    if (selectedPetsCount === 0) blockers.push('至少添加一个 Pets 维度');
    if (selectedUvCount === 0) blockers.push('至少选择一个 UV 指标');
    if (!analysis.kanoType) blockers.push('请选择 Kano 需求属性');
    if (analysis.usageRate === undefined) blockers.push('请设置使用率');
    if (analysis.penetrationRate === undefined) blockers.push('请设置渗透率');

    return {
        canCalculate: hasVehicleData && blockers.length === 0,
        blockers,
        selectedPetsCount,
        selectedUvCount,
        hasVehicleData
    };
}

function buildPetsPayload(entries: VehicleAnalysis['petsEntries']) {
    const enhancedPets: SelectedPetsPayload[] = entries
        .filter((entry) => entry.type === 'enhanced' && entry.uvL2Names.length > 0)
        .map((entry) => ({ petsId: entry.petsId, petsName: entry.petsName, uvL2Names: entry.uvL2Names }));

    const reducedPets: SelectedPetsPayload[] = entries
        .filter((entry) => entry.type === 'reduced' && entry.uvL2Names.length > 0)
        .map((entry) => ({ petsId: entry.petsId, petsName: entry.petsName, uvL2Names: entry.uvL2Names }));

    return { enhancedPets, reducedPets };
}

function mapAnalysisRecordToVehicleAnalysis(record: ProjectAnalysisRecord | undefined, hasVehicleData: boolean): VehicleAnalysis {
    const enhancedEntries = (record?.enhancedPets || []).map((entry) => ({
        petsId: entry.petsId,
        petsName: entry.petsName,
        type: 'enhanced' as const,
        uvL2Names: entry.uvL2Names || [],
        isExpanded: false
    }));

    const reducedEntries = (record?.reducedPets || []).map((entry) => ({
        petsId: entry.petsId,
        petsName: entry.petsName,
        type: 'reduced' as const,
        uvL2Names: entry.uvL2Names || [],
        isExpanded: false
    }));

    const base: VehicleAnalysis = {
        petsEntries: [...enhancedEntries, ...reducedEntries],
        kanoType: record?.kanoType,
        usageRate: record?.usageRate,
        penetrationRate: record?.penetrationRate,
        dirty: false,
        lastCalculatedAt: record?.updatedAt
    };

    return {
        ...base,
        validationState: buildValidationState(base, hasVehicleData)
    };
}

const ProjectDetail: React.FC = () => {
    const params = useParams<{ id?: string; projectId?: string }>();
    const id = params.id || params.projectId;

    const [project, setProject] = useState<Project | null>(null);
    const [petsList, setPetsList] = useState<Pets[]>([]);
    const [uvData, setUVData] = useState<UVL1[]>([]);
    const [vehicleDataStatus, setVehicleDataStatus] = useState<VehicleDataStatus[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSavingManual, setIsSavingManual] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    const [analysisData, setAnalysisData] = useState<ProjectAnalysisData>({});
    const [calculationResults, setCalculationResults] = useState<Record<string, CalculateUvaResponse>>({});
    const [currentVehicle, setCurrentVehicle] = useState('');
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

    const [isAddPetsOpen, setIsAddPetsOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { showToast, ToastComponent } = useToast();

    const vehicleHasData = useCallback(
        (vehicleId: string) => {
            const status = vehicleDataStatus.find((item) => item.id.toLowerCase() === vehicleId.toLowerCase());
            return status?.hasData !== false;
        },
        [vehicleDataStatus]
    );

    useEffect(() => {
        if (!id) return;

        const init = async () => {
            setIsLoading(true);
            try {
                const [projectData, petsData, uvDataResponse, vehicleStatus, savedAnalyses] = await Promise.all([
                    projectService.getById(id),
                    dataService.getPets(),
                    dataService.getUVData(),
                    dataService.getVehiclesDataStatus(),
                    dataService.getProjectAnalysis(id)
                ]);

                const analysesByVehicle = new Map(savedAnalyses.map((record) => [record.vehicle.toLowerCase(), record]));

                const nextAnalysis: ProjectAnalysisData = {};
                const nextResults: Record<string, CalculateUvaResponse> = {};

                projectData.vehicles.forEach((vehicle) => {
                    const record = analysesByVehicle.get(vehicle.toLowerCase());
                    const hasData = vehicleStatus.find((item) => item.id.toLowerCase() === vehicle.toLowerCase())?.hasData !== false;
                    nextAnalysis[vehicle] = mapAnalysisRecordToVehicleAnalysis(record, hasData);
                    if (record?.result) {
                        nextResults[vehicle] = record.result;
                    }
                });

                const firstVehicleWithData =
                    projectData.vehicles.find((vehicle) => {
                        const status = vehicleStatus.find((item) => item.id.toLowerCase() === vehicle.toLowerCase());
                        return status?.hasData !== false;
                    }) || projectData.vehicles[0];

                setProject(projectData);
                setPetsList(petsData);
                setUVData(uvDataResponse);
                setVehicleDataStatus(vehicleStatus);
                setAnalysisData(nextAnalysis);
                setCalculationResults(nextResults);
                setCurrentVehicle(firstVehicleWithData || '');
            } catch (error) {
                console.error('Failed to init project data', error);
                showToast('项目加载失败，请稍后重试', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        void init();
    }, [id, showToast]);

    const currentAnalysis = useMemo<VehicleAnalysis>(
        () =>
            analysisData[currentVehicle] || {
                petsEntries: [],
                dirty: false,
                validationState: buildValidationState({ petsEntries: [] }, vehicleHasData(currentVehicle))
            },
        [analysisData, currentVehicle, vehicleHasData]
    );

    const existingPetsIds = useMemo(() => currentAnalysis.petsEntries.map((entry) => entry.petsId), [currentAnalysis]);

    const currentSaveState = useMemo(() => {
        if (isSavingManual) return '保存中...';
        if (isSavingDraft) return '草稿保存中...';
        if (currentAnalysis.dirty) return '未保存';
        if (lastSavedAt) return `已保存 · ${new Date(lastSavedAt).toLocaleTimeString()}`;
        return '已同步';
    }, [currentAnalysis.dirty, isSavingDraft, isSavingManual, lastSavedAt]);

    const updateVehicleAnalysis = useCallback(
        (vehicle: string, updater: (previous: VehicleAnalysis) => VehicleAnalysis) => {
            setAnalysisData((previous) => {
                const fallback: VehicleAnalysis = { petsEntries: [] };
                const current = previous[vehicle] || fallback;
                const updated = updater(current);
                const withMeta: VehicleAnalysis = {
                    ...updated,
                    dirty: true
                };
                withMeta.validationState = buildValidationState(withMeta, vehicleHasData(vehicle));
                return {
                    ...previous,
                    [vehicle]: withMeta
                };
            });
        },
        [vehicleHasData]
    );

    const persistVehicle = useCallback(
        async (vehicle: string, draft: boolean) => {
            if (!project?.id) return;

            const snapshot = analysisData[vehicle];
            if (!snapshot) return;

            const { enhancedPets, reducedPets } = buildPetsPayload(snapshot.petsEntries);

            if (draft) setIsSavingDraft(true);
            else setIsSavingManual(true);

            try {
                const saved = await dataService.saveAnalysis({
                    projectId: project.id,
                    vehicle,
                    enhancedPets,
                    reducedPets,
                    kanoType: snapshot.kanoType,
                    usageRate: snapshot.usageRate,
                    penetrationRate: snapshot.penetrationRate,
                    result: calculationResults[vehicle],
                    draft,
                    clientUpdatedAt: new Date().toISOString()
                });

                setAnalysisData((previous) => ({
                    ...previous,
                    [vehicle]: {
                        ...(previous[vehicle] || snapshot),
                        dirty: false,
                        validationState: buildValidationState(previous[vehicle] || snapshot, vehicleHasData(vehicle))
                    }
                }));
                setLastSavedAt(saved.updatedAt);

                if (!draft) {
                    showToast('项目已保存', 'success');
                }
            } catch (error) {
                console.error('Save failed', error);
                showToast(draft ? '草稿保存失败' : '保存失败，请重试', 'error');
            } finally {
                if (draft) setIsSavingDraft(false);
                else setIsSavingManual(false);
            }
        },
        [analysisData, calculationResults, project?.id, showToast, vehicleHasData]
    );

    useEffect(() => {
        if (!project?.id || !currentVehicle) return;
        if (!analysisData[currentVehicle]?.dirty) return;

        const timer = setTimeout(() => {
            void persistVehicle(currentVehicle, true);
        }, 1200);

        return () => clearTimeout(timer);
    }, [analysisData, currentVehicle, persistVehicle, project?.id]);

    const handleAddPets = (petsId: string, petsName: string, type: 'enhanced' | 'reduced') => {
        updateVehicleAnalysis(currentVehicle, (previous) => ({
            ...previous,
            petsEntries: [...previous.petsEntries, { petsId, petsName, type, uvL2Names: [], isExpanded: true }]
        }));
    };

    const handleDeletePets = (petsId: string) => {
        updateVehicleAnalysis(currentVehicle, (previous) => ({
            ...previous,
            petsEntries: previous.petsEntries.filter((entry) => entry.petsId !== petsId)
        }));
    };

    const handleToggleExpand = (petsId: string) => {
        updateVehicleAnalysis(currentVehicle, (previous) => ({
            ...previous,
            petsEntries: previous.petsEntries.map((entry) =>
                entry.petsId === petsId ? { ...entry, isExpanded: !entry.isExpanded } : entry
            )
        }));
    };

    const handleToggleUV = (petsId: string, uvL2Name: string) => {
        updateVehicleAnalysis(currentVehicle, (previous) => ({
            ...previous,
            petsEntries: previous.petsEntries.map((entry) => {
                if (entry.petsId !== petsId) return entry;

                const exists = entry.uvL2Names.includes(uvL2Name);
                return {
                    ...entry,
                    uvL2Names: exists
                        ? entry.uvL2Names.filter((name) => name !== uvL2Name)
                        : [...entry.uvL2Names, uvL2Name]
                };
            })
        }));
    };

    const handleUpdateConfig = (
        field: 'kanoType' | 'usageRate' | 'penetrationRate',
        value: VehicleAnalysis['kanoType'] | number
    ) => {
        updateVehicleAnalysis(currentVehicle, (previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleCalculate = async () => {
        if (!currentVehicle) return;

        const validationState = currentAnalysis.validationState || buildValidationState(currentAnalysis, vehicleHasData(currentVehicle));
        if (!validationState.canCalculate) {
            showToast(validationState.blockers[0] || (validationState.hasVehicleData ? '请先补齐配置' : '当前车型暂不可操作'), 'warning');
            return;
        }

        const { enhancedPets, reducedPets } = buildPetsPayload(currentAnalysis.petsEntries);

        setIsCalculating(true);
        try {
            const result = await dataService.calculateUVA({
                vehicle: currentVehicle,
                enhancedPets,
                reducedPets,
                kanoType: currentAnalysis.kanoType,
                usageRate: currentAnalysis.usageRate,
                penetrationRate: currentAnalysis.penetrationRate
            });

            setCalculationResults((previous) => ({
                ...previous,
                [currentVehicle]: result
            }));
            setAnalysisData((previous) => {
                const nextVehicle = previous[currentVehicle] || currentAnalysis;
                const withMeta: VehicleAnalysis = {
                    ...nextVehicle,
                    dirty: true,
                    lastCalculatedAt: new Date().toISOString()
                };
                withMeta.validationState = buildValidationState(withMeta, vehicleHasData(currentVehicle));
                return {
                    ...previous,
                    [currentVehicle]: withMeta
                };
            });
            showToast('测算完成', 'success');
        } catch (error) {
            console.error('Calculate failed', error);
            showToast('测算失败，请检查配置后重试', 'error');
        } finally {
            setIsCalculating(false);
        }
    };

    const handleSaveAll = async () => {
        if (!project) return;

        for (const vehicle of project.vehicles) {
            // sequential save to avoid request storm and keep deterministic ordering
            await persistVehicle(vehicle, false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) return null;

    const orderedVehicles = [...project.vehicles].sort((first, second) => {
        if (first === currentVehicle) return -1;
        if (second === currentVehicle) return 1;
        return 0;
    });

    const currentValidation = currentAnalysis.validationState || buildValidationState(currentAnalysis, vehicleHasData(currentVehicle));
    const currentVehicleOperable = vehicleHasData(currentVehicle);

    return (
        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
            <PageHeader
                title={project.name}
                description={project.description || '暂无描述'}
                status={{ label: currentSaveState, tone: currentAnalysis.dirty ? 'warning' : 'success' }}
                meta={`项目车型: ${project.vehicles.map((vehicle) => formatEnglishLabel(vehicle)).join(' · ')}`}
                actions={
                    <>
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsEditModalOpen(true)} title="编辑项目信息">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="outline" onClick={handleSaveAll} disabled={isSavingManual}>
                            <Save className="h-4 w-4" />
                            保存
                        </Button>
                        <Button type="button" variant="action" onClick={handleCalculate} disabled={isCalculating || !currentValidation.canCalculate}>
                            {isCalculating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
                            {isCalculating ? '测算中...' : '测算'}
                        </Button>
                    </>
                }
            />

            <VehicleTabs
                items={project.vehicles.map((vehicle) => ({
                    id: vehicle,
                    label: vehicle,
                    hasData: vehicleHasData(vehicle)
                }))}
                value={currentVehicle}
                onChange={setCurrentVehicle}
            />

            {!currentVehicleOperable ? (
                <InlineStatusBar tone="info" title="当前车型为只读状态" description="录入与测算控件已禁用，请切换到可操作车型。" />
            ) : currentValidation.canCalculate ? (
                <InlineStatusBar
                    tone="success"
                    title="当前车型可直接测算"
                    description={`已选择 ${currentValidation.selectedPetsCount} 个 Pets，${currentValidation.selectedUvCount} 个 UV。`}
                />
            ) : (
                <InlineStatusBar
                    tone="warning"
                    title="还有配置项未完成"
                    description={currentValidation.blockers.length > 0 ? currentValidation.blockers.join('；') : '请补齐配置后再进行测算。'}
                />
            )}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
                <section className={cn('surface-panel space-y-5 rounded-card p-5 sm:p-6', !currentVehicleOperable && 'surface-disabled')}>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="ui-label">Input Workspace</p>
                            <h2 className="ui-h2 text-text-primary">体验维度录入 · {formatEnglishLabel(currentVehicle)}</h2>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddPetsOpen(true)}
                            disabled={!currentVehicleOperable}
                        >
                            <Plus className="h-4 w-4" />
                            添加 Pets
                        </Button>
                    </div>

                    {currentAnalysis.petsEntries.length === 0 ? (
                        <EmptyStateBlock
                            title="暂无录入数据"
                            description="请先添加体验维度，再展开勾选具体 UV 指标。"
                            actionLabel="添加第一个维度"
                            onAction={() => setIsAddPetsOpen(true)}
                        />
                    ) : (
                        <div className="space-y-3">
                            {currentAnalysis.petsEntries.map((entry) => (
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

                    {currentAnalysis.petsEntries.length > 0 ? (
                        <div className="surface-inset space-y-4 rounded-card p-4 sm:p-5">
                            <div className="space-y-1">
                                <p className="ui-label">Parameters</p>
                                <h3 className="text-ds-body font-semibold text-text-primary">附加配置</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-ds-caption text-text-secondary">Kano 需求属性</label>
                                <RadioGroup
                                    name={`kano-${currentVehicle}`}
                                    value={currentAnalysis.kanoType}
                                    onChange={(value) => handleUpdateConfig('kanoType', value as VehicleAnalysis['kanoType'])}
                                    options={[
                                        { value: 'must-be', label: '必备型' },
                                        { value: 'performance', label: '期望型' },
                                        { value: 'attractive', label: '魅力型' }
                                    ]}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="surface-panel-soft rounded-control p-3.5">
                                    <label className="mb-3 block text-ds-caption text-text-secondary">使用率</label>
                                    <Slider
                                        value={currentAnalysis.usageRate ?? 0}
                                        min={0}
                                        max={100}
                                        unit="%"
                                        onChange={(value) => handleUpdateConfig('usageRate', value)}
                                    />
                                </div>
                                <div className="surface-panel-soft rounded-control p-3.5">
                                    <label className="mb-3 block text-ds-caption text-text-secondary">渗透率</label>
                                    <Slider
                                        value={currentAnalysis.penetrationRate ?? 0}
                                        min={0}
                                        max={100}
                                        unit="%"
                                        onChange={(value) => handleUpdateConfig('penetrationRate', value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </section>

                <section className="surface-panel space-y-4 rounded-card p-5 sm:p-6">
                    <div className="space-y-1">
                        <p className="ui-label">Output Workspace</p>
                        <h2 className="ui-h2 text-text-primary">UVA 测算结果</h2>
                    </div>
                    {orderedVehicles.map((vehicle) => (
                        <VehicleResultPanel
                            key={vehicle}
                            vehicle={vehicle}
                            result={calculationResults[vehicle] || null}
                            config={analysisData[vehicle]}
                            isActive={vehicle === currentVehicle}
                        />
                    ))}
                </section>
            </div>

            {isAddPetsOpen ? (
                <AddPetsDialog
                    petsList={petsList}
                    existingPetsIds={existingPetsIds}
                    onAdd={handleAddPets}
                    onClose={() => setIsAddPetsOpen(false)}
                />
            ) : null}

            <EditProjectModal
                isOpen={isEditModalOpen}
                project={project}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={(updatedProject) => setProject(updatedProject)}
            />

            <ToastComponent />
        </div>
    );
};

export default ProjectDetail;
