import React from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronRight, Car, Gauge, Users, Tag } from 'lucide-react';
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

    // Render hierarchical requirement groups with visual accumulation
    const renderRequirementGroups = (groups: any[], type: 'enhanced' | 'reduced') => {
        if (!groups || groups.length === 0) return <p className="text-sm text-muted-foreground py-2">无数据</p>;

        const isPositive = type === 'enhanced';
        const colorClass = isPositive ? 'text-green-700' : 'text-red-600';
        const bgGradient = isPositive
            ? 'from-green-500 to-emerald-400'
            : 'from-red-500 to-rose-400';
        const lightBg = isPositive ? 'bg-green-50' : 'bg-red-50';

        return (
            <div className="space-y-3">
                {groups.map((group: any, idx: number) => (
                    <div key={group.categoryName} className="rounded-lg overflow-hidden border border-border">
                        {/* Requirement Type Header with Score Bar */}
                        <div className={`relative ${lightBg}`}>
                            {/* Score Progress Bar Background */}
                            <div
                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${bgGradient} opacity-20`}
                                style={{ width: `${Math.min((group.totalScore / maxScore) * 100, 100)}%` }}
                            />
                            <div className="relative flex items-center justify-between px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-muted-foreground bg-white/80 px-1.5 py-0.5 rounded">
                                        L{idx + 1}
                                    </span>
                                    <span className="font-semibold text-sm text-foreground">{group.categoryName}</span>
                                </div>
                                <span className={`text-sm font-bold ${colorClass}`}>
                                    {isPositive ? '+' : '-'}{group.totalScore.toFixed(1)}
                                </span>
                            </div>
                        </div>

                        {/* UV L1 List */}
                        <div className="divide-y divide-border/50">
                            {group.l1List.map((l1: any) => (
                                <div key={l1.l1Name} className="bg-white">
                                    {/* L1 Header */}
                                    <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
                                        <span className="text-sm font-medium text-foreground">{l1.l1Name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${bgGradient}`}
                                                    style={{ width: `${Math.min((l1.totalScore / group.totalScore) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-semibold ${colorClass}`}>
                                                {l1.totalScore.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* L2 Details */}
                                    <div className="px-4 py-2 space-y-1.5">
                                        {l1.l2List.map((l2: any) => (
                                            <div key={l2.l2Name} className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground truncate pr-4 max-w-[200px]">{l2.l2Name}</span>
                                                <span className={`font-medium ${colorClass}`}>
                                                    {isPositive ? '+' : '-'}{l2.score.toFixed(1)}
                                                </span>
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

    return (
        <div className={`bg-white rounded-xl border-2 ${isActive ? 'border-primary/30' : 'border-border'} overflow-hidden shadow-sm`}>
            {/* Header with Score */}
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

            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-border">
                    {/* Configuration Summary Cards - PROMINENT */}
                    {config && (config.kanoType || config.usageRate !== undefined || config.penetrationRate !== undefined) && (
                        <div className="p-4 bg-muted/20 border-b border-border">
                            <div className="grid grid-cols-3 gap-3">
                                {/* Kano Type Card */}
                                <div className="bg-white rounded-lg border border-border p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                        <Tag size={12} />
                                        <span className="text-xs font-medium">需求类型</span>
                                    </div>
                                    <div className="text-sm font-bold text-foreground">
                                        {getKanoLabel(config.kanoType)}
                                    </div>
                                </div>

                                {/* Usage Rate Card */}
                                <div className="bg-white rounded-lg border border-border p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                        <Gauge size={12} />
                                        <span className="text-xs font-medium">使用率</span>
                                    </div>
                                    <div className="text-sm font-bold text-primary">
                                        {config.usageRate || 0}%
                                    </div>
                                </div>

                                {/* Penetration Rate Card */}
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
                    <div className="p-4 space-y-4">
                        {/* Enhanced Section */}
                        {totalEnhanced > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                                        <TrendingUp size={16} />
                                        <span>增强体验</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">+{totalEnhanced.toFixed(1)}</span>
                                </div>
                                {enhanced?.requirementGroups
                                    ? renderRequirementGroups(enhanced.requirementGroups, 'enhanced')
                                    : <p className="text-xs text-muted-foreground">旧版数据，重新测算以查看详情</p>
                                }
                            </div>
                        )}

                        {/* Reduced Section */}
                        {totalReduced > 0 && (
                            <div className={totalEnhanced > 0 ? 'pt-4 border-t border-border' : ''}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                                        <TrendingDown size={16} />
                                        <span>降低体验</span>
                                    </div>
                                    <span className="text-lg font-bold text-red-500">-{totalReduced.toFixed(1)}</span>
                                </div>
                                {reduced?.requirementGroups
                                    ? renderRequirementGroups(reduced.requirementGroups, 'reduced')
                                    : <p className="text-xs text-muted-foreground">旧版数据，重新测算以查看详情</p>
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
