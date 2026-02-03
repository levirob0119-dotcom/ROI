import React from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronRight, Car, Gauge, Users, Tag, Diamond } from 'lucide-react';
import type { VehicleAnalysis } from '../../types/analysis';

interface VehicleResultPanelProps {
    vehicle: string;
    result: any | null;
    config?: VehicleAnalysis;
    isActive: boolean;
}

const VehicleResultPanel: React.FC<VehicleResultPanelProps> = ({
    vehicle,
    result,
    config,
    isActive
}) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    // Track expanded state for each PETS
    const [expandedPets, setExpandedPets] = React.useState<Record<string, boolean>>({});

    // Initialize/Sync expanded states when result changes
    React.useEffect(() => {
        if (result) {
            const initialExpanded: Record<string, boolean> = {};
            if (result.enhanced?.petsList) {
                result.enhanced.petsList.forEach((p: any) => initialExpanded[p.petsId] = true);
            }
            if (result.reduced?.petsList) {
                result.reduced.petsList.forEach((p: any) => initialExpanded[p.petsId] = true);
            }
            setExpandedPets(initialExpanded);
        }
    }, [result]);

    const togglePetsExpand = (petsId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedPets(prev => ({
            ...prev,
            [petsId]: !prev[petsId]
        }));
    };

    // Get Kano label
    const getKanoLabel = (type?: string) => {
        switch (type) {
            case 'must-be': return '必备型';
            case 'performance': return '期望型';
            case 'attractive': return '魅力型';
            default: return '未设置';
        }
    };

    if (!result) {
        return (
            <div className={`bg-white rounded-xl border-2 ${isActive ? 'border-primary/30' : 'border-border'} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                    <Car size={16} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                    <span className={`font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {vehicle.toUpperCase()}
                    </span>
                    {isActive && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">当前</span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">尚未录入数据</p>
            </div>
        );
    }

    const { totalEnhanced, totalReduced, finalScore, enhanced, reduced } = result;
    const maxScore = Math.max(totalEnhanced, totalReduced, 50); // For progress bar normalization

    // Render Requirement Groups (Children of PETS)
    const renderRequirementGroups = (groups: any[], type: 'enhanced' | 'reduced', petsTotal: number) => {
        if (!groups || groups.length === 0) return <p className="text-xs text-muted-foreground pl-4 py-1">无细分数据</p>;

        const isPositive = type === 'enhanced';
        const colorClass = isPositive ? 'text-green-700' : 'text-red-600';
        const bgBarColor = isPositive ? 'bg-green-500' : 'bg-red-500';

        return (
            <div className="space-y-3 pt-2">
                {groups.map((group: any) => (
                    <div key={group.categoryName} className="relative pl-3 border-l-2 border-border/40 ml-1">
                        {/* Level 3: Requirement Type Header */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-sm">
                                {group.categoryName}
                            </span>
                            <span className={`text-xs font-bold ${colorClass}`}>
                                {isPositive ? '+' : '-'}{group.totalScore.toFixed(1)}
                            </span>
                        </div>

                        {/* Level 4: UV L1 List */}
                        <div className="space-y-2">
                            {group.l1List.map((l1: any) => (
                                <div key={l1.l1Name} className="group/l1">
                                    {/* L1 Info with Progress Bar */}
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-600 font-medium">{l1.l1Name}</span>
                                        <span className={`font-semibold ${colorClass}`}>
                                            {l1.totalScore.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-1.5">
                                        <div
                                            className={`h-full ${bgBarColor} opacity-80`}
                                            style={{ width: `${Math.min((l1.totalScore / (petsTotal || 1)) * 100, 100)}%` }}
                                        />
                                    </div>

                                    {/* Level 5: UV L2 List (Compact) */}
                                    <div className="pl-2 space-y-1">
                                        {l1.l2List.map((l2: any) => (
                                            <div key={l2.l2Name} className="flex items-center justify-between text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                                                    <span className="truncate max-w-[180px]">{l2.l2Name}</span>
                                                </div>
                                                <span>{l2.score.toFixed(1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render PETS Groups
    const renderPetsGroups = (petsList: any[], type: 'enhanced' | 'reduced') => {
        if (!petsList || petsList.length === 0) return <p className="text-sm text-muted-foreground py-2">无数据</p>;

        const isPositive = type === 'enhanced';
        const colorClass = isPositive ? 'text-green-700' : 'text-red-600';
        const bgClass = isPositive ? 'bg-green-50/50' : 'bg-red-50/50';
        const borderClass = isPositive ? 'border-green-100' : 'border-red-100';

        return (
            <div className="space-y-3">
                {petsList.map((pets: any) => {
                    const isPetsExpanded = expandedPets[pets.petsId];
                    return (
                        <div key={pets.petsId} className={`rounded-lg border ${borderClass} ${bgClass} overflow-hidden`}>
                            {/* Level 2: PETS Header (Collapsible) */}
                            <div
                                className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-white/50 transition-colors"
                                onClick={(e) => togglePetsExpand(pets.petsId, e)}
                            >
                                <div className="flex items-center gap-2">
                                    {isPetsExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                                    <Diamond size={14} className={isPositive ? 'text-green-600' : 'text-red-500'} />
                                    <span className="font-bold text-sm text-gray-800">{pets.petsName}</span>
                                </div>
                                <span className={`text-sm font-bold ${colorClass}`}>
                                    {isPositive ? '+' : '-'}{pets.totalScore.toFixed(1)}
                                </span>
                            </div>

                            {/* PETS Content */}
                            {isPetsExpanded && (
                                <div className="px-3 pb-3 bg-white/40">
                                    {renderRequirementGroups(pets.requirementGroups, type, pets.totalScore)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={`bg-white rounded-xl border-2 ${isActive ? 'border-primary/30' : 'border-border'} overflow-hidden shadow-sm`}>
            {/* Level 0: Header with Final Score */}
            <div
                className={`cursor-pointer ${isActive ? 'bg-primary/5' : 'bg-muted/30'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <Car size={16} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                        <span className={`font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {vehicle.toUpperCase()}
                        </span>
                        {isActive && (
                            <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">当前</span>
                        )}
                    </div>
                    <div className={`text-xl font-bold ${finalScore > 0 ? 'text-green-600' : finalScore < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {finalScore > 0 ? '+' : ''}{finalScore.toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Config & Detailed Results */}
            {isExpanded && (
                <div className="border-t border-border">
                    {/* Configuration Summary Cards */}
                    {config && (config.kanoType || config.usageRate !== undefined || config.penetrationRate !== undefined) && (
                        <div className="p-4 bg-muted/20 border-b border-border">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white rounded-lg border border-border p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                        <Tag size={12} />
                                        <span className="text-xs font-medium">需求类型</span>
                                    </div>
                                    <div className="text-sm font-bold text-foreground">
                                        {getKanoLabel(config.kanoType)}
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg border border-border p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                        <Gauge size={12} />
                                        <span className="text-xs font-medium">使用率</span>
                                    </div>
                                    <div className="text-sm font-bold text-primary">
                                        {config.usageRate || 0}%
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg border border-border p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                        <Users size={12} />
                                        <span className="text-xs font-medium">渗透率</span>
                                    </div>
                                    <div className="text-sm font-bold text-primary">
                                        {config.penetrationRate || 0}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Score Details */}
                    <div className="p-4 space-y-6">
                        {/* Level 1: Enhanced Section */}
                        {totalEnhanced > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3 border-b border-green-100 pb-2">
                                    <div className="flex items-center gap-2 text-green-700 font-bold">
                                        <TrendingUp size={16} />
                                        <span>提升体验</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">+{totalEnhanced.toFixed(1)}</span>
                                </div>
                                {enhanced?.petsList
                                    ? renderPetsGroups(enhanced.petsList, 'enhanced')
                                    : <p className="text-xs text-muted-foreground">数据格式不兼容，请重新测算</p>
                                }
                            </div>
                        )}

                        {/* Level 1: Reduced Section */}
                        {totalReduced > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3 border-b border-red-100 pb-2">
                                    <div className="flex items-center gap-2 text-red-600 font-bold">
                                        <TrendingDown size={16} />
                                        <span>降低体验</span>
                                    </div>
                                    <span className="text-lg font-bold text-red-500">-{totalReduced.toFixed(1)}</span>
                                </div>
                                {reduced?.petsList
                                    ? renderPetsGroups(reduced.petsList, 'reduced')
                                    : <p className="text-xs text-muted-foreground">数据格式不兼容，请重新测算</p>
                                }
                            </div>
                        )}

                        {/* Empty State */}
                        {totalEnhanced === 0 && totalReduced === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">暂无测算结果</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleResultPanel;
