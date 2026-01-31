import React, { useState, useMemo } from 'react';
import { Plus, Minus, ChevronDown, ChevronRight, Trash2, Check, Monitor, Car, AlertTriangle } from 'lucide-react';
import type { Pets, UVL1, VehicleDataStatus } from '@/services/data';
import './AnalysisInput.css';

// PETS 卡片条目
interface PetsEntry {
    petsId: string;
    petsName: string;
    type: 'enhanced' | 'reduced';
    uvL2Names: string[];
    isExpanded: boolean;
}

interface AnalysisInputProps {
    petsList: Pets[];
    uvData: UVL1[];
    vehicles: string[];
    vehiclesDataStatus: VehicleDataStatus[];
    currentVehicle: string;
    petsEntries: PetsEntry[];
    onVehicleChange: (vehicle: string) => void;
    onAddPets: (petsId: string, petsName: string, type: 'enhanced' | 'reduced') => void;
    onDeletePets: (petsId: string) => void;
    onToggleExpand: (petsId: string) => void;
    onToggleUV: (petsId: string, uvL2Name: string) => void;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({
    petsList,
    uvData,
    vehicles,
    vehiclesDataStatus,
    currentVehicle,
    petsEntries,
    onVehicleChange,
    onAddPets,
    onDeletePets,
    onToggleExpand,
    onToggleUV
}) => {
    // 当前选择的添加模式
    const [addMode, setAddMode] = useState<'enhanced' | 'reduced' | null>(null);

    const existingPetsIds = petsEntries.map(e => e.petsId);
    const availablePets = petsList.filter(p => !existingPetsIds.includes(p.id));

    // 检查当前车型是否有数据
    const currentVehicleHasData = useMemo(() => {
        const status = vehiclesDataStatus.find(v => v.id.toLowerCase() === currentVehicle.toLowerCase());
        return status?.hasData ?? false;
    }, [vehiclesDataStatus, currentVehicle]);

    const handleSelectPets = (petsId: string) => {
        if (!addMode) return;
        const pets = petsList.find(p => p.id === petsId);
        if (pets) {
            onAddPets(petsId, pets.name, addMode);
        }
        setAddMode(null);
    };

    return (
        <div className="analysis-input">
            {/* Header with Vehicle Tabs */}
            <div className="analysis-input-header">
                <div className="analysis-input-header-top">
                    <h2>体验维度录入</h2>
                </div>

                {/* 车型 Tabs - 显示数据状态 */}
                <div className="vehicle-tabs-inline">
                    {vehicles.map(v => {
                        const isActive = currentVehicle === v;
                        const status = vehiclesDataStatus.find(s => s.id.toLowerCase() === v.toLowerCase());
                        const hasData = status?.hasData ?? false;

                        return (
                            <button
                                key={v}
                                onClick={() => onVehicleChange(v)}
                                className={`vehicle-tab-inline ${isActive ? 'vehicle-tab-inline--active' : ''} ${!hasData ? 'vehicle-tab-inline--no-data' : ''}`}
                                title={hasData ? '' : '暂无 UVA 数据'}
                            >
                                <Car size={12} />
                                {v.toUpperCase()}
                                {!hasData && <span className="no-data-dot" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 无数据车型提示 */}
            {!currentVehicleHasData && (
                <div className="no-data-warning">
                    <AlertTriangle size={16} />
                    <span>{currentVehicle.toUpperCase()} 暂无 UVA 数据，无法进行测算</span>
                </div>
            )}

            {/* 两个添加按钮 - 无数据时禁用 */}
            <div className="add-buttons-row">
                <button
                    className={`add-btn add-btn--enhanced ${addMode === 'enhanced' ? 'add-btn--active' : ''}`}
                    onClick={() => setAddMode(addMode === 'enhanced' ? null : 'enhanced')}
                    disabled={availablePets.length === 0 || !currentVehicleHasData}
                >
                    <Plus size={16} />
                    增强体验
                </button>
                <button
                    className={`add-btn add-btn--reduced ${addMode === 'reduced' ? 'add-btn--active' : ''}`}
                    onClick={() => setAddMode(addMode === 'reduced' ? null : 'reduced')}
                    disabled={availablePets.length === 0 || !currentVehicleHasData}
                >
                    <Minus size={16} />
                    减弱体验
                </button>
            </div>

            {/* PETS 选择面板 (内联展开) */}
            {addMode && availablePets.length > 0 && currentVehicleHasData && (
                <div className="pets-selection-panel">
                    <div className="pets-selection-title">
                        选择要{addMode === 'enhanced' ? '增强' : '减弱'}的体验维度
                    </div>
                    <div className="pets-options-grid">
                        {availablePets.map(pets => (
                            <button
                                key={pets.id}
                                className="pets-option-btn"
                                onClick={() => handleSelectPets(pets.id)}
                            >
                                {pets.name}
                            </button>
                        ))}
                    </div>
                    <div className="pets-selection-footer">
                        <button
                            className="btn-ghost"
                            onClick={() => setAddMode(null)}
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="analysis-input-content">
                {!currentVehicleHasData ? (
                    <div className="empty-state empty-state--no-data">
                        <AlertTriangle size={40} className="empty-state-icon empty-state-icon--warning" />
                        <p className="empty-state-text">该车型暂无 UVA 数据</p>
                        <p className="empty-state-hint">
                            请切换至有数据的车型（如 CETUS）或联系管理员导入数据
                        </p>
                    </div>
                ) : petsEntries.length === 0 ? (
                    <div className="empty-state">
                        <Monitor size={40} className="empty-state-icon" />
                        <p className="empty-state-text">暂无录入数据</p>
                        <p className="empty-state-hint">
                            点击上方「增强体验」或「减弱体验」开始添加
                        </p>
                    </div>
                ) : (
                    <div className="pets-cards-list">
                        {petsEntries.map(entry => (
                            <PetsCard
                                key={entry.petsId}
                                entry={entry}
                                uvData={uvData}
                                onToggleExpand={() => onToggleExpand(entry.petsId)}
                                onDelete={() => onDeletePets(entry.petsId)}
                                onToggleUV={(uvName) => onToggleUV(entry.petsId, uvName)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// PETS Card 子组件
interface PetsCardProps {
    entry: PetsEntry;
    uvData: UVL1[];
    onToggleExpand: () => void;
    onDelete: () => void;
    onToggleUV: (uvL2Name: string) => void;
}

const PetsCard: React.FC<PetsCardProps> = ({
    entry,
    uvData,
    onToggleExpand,
    onDelete,
    onToggleUV
}) => {
    // 使用 number 类型匹配 l1_id，默认全部折叠
    const [expandedL1s, setExpandedL1s] = useState<Set<number>>(new Set());

    const isEnhanced = entry.type === 'enhanced';
    const cardClass = `pets-card ${isEnhanced ? 'pets-card--enhanced' : 'pets-card--reduced'}`;

    const toggleL1 = (l1Id: number) => {
        setExpandedL1s(prev => {
            const next = new Set(prev);
            if (next.has(l1Id)) {
                next.delete(l1Id);
            } else {
                next.add(l1Id);
            }
            return next;
        });
    };

    // 计算每个 L1 下的选中数量
    const getL1SelectionCount = (l1: UVL1): { selected: number; total: number } => {
        const total = l1.l2_items.length;
        const selected = l1.l2_items.filter(l2 => entry.uvL2Names.includes(l2.name)).length;
        return { selected, total };
    };

    return (
        <div className={cardClass}>
            {/* Header */}
            <div className="pets-card-header" onClick={onToggleExpand}>
                <div className="pets-card-header-left">
                    {entry.isExpanded ? (
                        <ChevronDown size={16} className="pets-card-expand-icon" />
                    ) : (
                        <ChevronRight size={16} className="pets-card-expand-icon" />
                    )}
                    <span className="pets-card-name">{entry.petsName}</span>
                    <span className={`pets-card-type-badge ${isEnhanced ? 'pets-card-type-badge--enhanced' : 'pets-card-type-badge--reduced'}`}>
                        {isEnhanced ? '+增强' : '−减弱'}
                    </span>
                </div>
                <div className="pets-card-header-right">
                    <span className="pets-card-uv-count">
                        {entry.uvL2Names.length} 个 UV
                    </span>
                    <button
                        className="pets-card-delete-btn"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Expanded Content - 树状 UV 列表 */}
            {entry.isExpanded && (
                <div className="pets-card-content">
                    {uvData.map(l1 => {
                        const isL1Expanded = expandedL1s.has(l1.l1_id);
                        const { selected, total } = getL1SelectionCount(l1);

                        return (
                            <div key={l1.l1_id} className="uv-l1-section">
                                {/* L1 Header - 可折叠 */}
                                <div
                                    className="uv-l1-header"
                                    onClick={() => toggleL1(l1.l1_id)}
                                >
                                    <div className="uv-l1-header-left">
                                        {isL1Expanded ? (
                                            <ChevronDown size={14} className="uv-l1-expand-icon" />
                                        ) : (
                                            <ChevronRight size={14} className="uv-l1-expand-icon" />
                                        )}
                                        <span className="uv-l1-title">{l1.l1_name}</span>
                                    </div>
                                    <span className="uv-l1-count">
                                        {selected}/{total}
                                    </span>
                                </div>

                                {/* L2 Items */}
                                {isL1Expanded && (
                                    <div className="uv-l2-list">
                                        {l1.l2_items.map(l2 => {
                                            const isSelected = entry.uvL2Names.includes(l2.name);
                                            const itemClass = `uv-l2-item ${isSelected ? (isEnhanced ? 'uv-l2-item--selected-enhanced' : 'uv-l2-item--selected-reduced') : ''}`;
                                            const checkboxClass = `uv-l2-checkbox ${isSelected ? (isEnhanced ? 'uv-l2-checkbox--checked-enhanced' : 'uv-l2-checkbox--checked-reduced') : ''}`;

                                            return (
                                                <div
                                                    key={l2.id}
                                                    className={itemClass}
                                                    onClick={() => onToggleUV(l2.name)}
                                                >
                                                    <div className={checkboxClass}>
                                                        {isSelected && <Check size={10} className="uv-l2-checkbox-icon" />}
                                                    </div>
                                                    <span className="uv-l2-name">{l2.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AnalysisInput;
