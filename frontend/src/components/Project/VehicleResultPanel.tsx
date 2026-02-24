import React from 'react';
import { Car, ChevronDown, ChevronRight, Gauge, Tag, Users } from 'lucide-react';

import ResultHierarchyTree from '@/components/patterns/ResultHierarchyTree';
import ScoreSummary from '@/components/patterns/ScoreSummary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatEnglishLabel } from '@/lib/utils';
import type { CalculateUvaResponse } from '@/services/data';
import type { VehicleAnalysis } from '@/types/analysis';

interface VehicleResultPanelProps {
    vehicle: string;
    result: CalculateUvaResponse | null;
    config?: VehicleAnalysis;
    isActive: boolean;
}

const getKanoLabel = (type?: string) => {
    switch (type) {
        case 'must-be':
            return '必备型';
        case 'performance':
            return '期望型';
        case 'attractive':
            return '魅力型';
        default:
            return '未设置';
    }
};

const VehicleResultPanel: React.FC<VehicleResultPanelProps> = ({ vehicle, result, config, isActive }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);

    if (!result) {
        return (
            <section className={`rounded-card bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.1)] ${isActive ? 'bg-primary/5' : ''}`}>
                <div className="mb-2 flex items-center gap-2">
                    <Car size={16} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                    <h3 className="text-ds-body font-semibold text-text-primary">{formatEnglishLabel(vehicle)}</h3>
                    {isActive ? <Badge>当前车型</Badge> : null}
                </div>
                <p className="text-ds-body-sm text-text-secondary">尚未录入数据或尚未测算。</p>
            </section>
        );
    }

    const { totalEnhanced, totalReduced, finalScore, enhanced, reduced } = result;

    return (
        <section className={`overflow-hidden rounded-card bg-white shadow-[0_14px_30px_rgba(15,23,42,0.1)] ${isActive ? 'bg-primary/[0.02]' : ''}`}>
            <Button
                type="button"
                variant="ghost"
                className={`h-auto w-full justify-between rounded-none px-4 py-3 text-left hover:bg-surface ${isActive ? 'bg-primary/5 hover:bg-primary/5' : 'bg-surface'}`}
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                <span className="inline-flex items-center gap-2 text-ds-body font-semibold text-text-primary">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <Car className="h-4 w-4" />
                    {formatEnglishLabel(vehicle)}
                </span>
                {isActive ? <Badge>当前车型</Badge> : null}
            </Button>

            {isExpanded ? (
                <div className="space-y-4 p-4">
                    <ScoreSummary
                        finalScore={finalScore}
                        totalEnhanced={totalEnhanced}
                        totalReduced={totalReduced}
                        lastCalculatedAt={config?.lastCalculatedAt}
                    />

                    {config ? (
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <div className="rounded-control bg-surface px-3 py-2">
                                <p className="mb-1 inline-flex items-center gap-1 text-ds-caption text-text-secondary">
                                    <Tag className="h-3.5 w-3.5" />
                                    Kano 类型
                                </p>
                                <p className="text-ds-body-sm font-semibold text-text-primary">{getKanoLabel(config.kanoType)}</p>
                            </div>
                            <div className="rounded-control bg-surface px-3 py-2">
                                <p className="mb-1 inline-flex items-center gap-1 text-ds-caption text-text-secondary">
                                    <Gauge className="h-3.5 w-3.5" />
                                    使用率
                                </p>
                                <p className="text-ds-body-sm font-semibold text-text-primary">{config.usageRate ?? 0}%</p>
                            </div>
                            <div className="rounded-control bg-surface px-3 py-2">
                                <p className="mb-1 inline-flex items-center gap-1 text-ds-caption text-text-secondary">
                                    <Users className="h-3.5 w-3.5" />
                                    渗透率
                                </p>
                                <p className="text-ds-body-sm font-semibold text-text-primary">{config.penetrationRate ?? 0}%</p>
                            </div>
                        </div>
                    ) : null}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-success/20 pb-1">
                                <h4 className="text-ds-body-sm font-semibold text-success">提升体验</h4>
                                <span className="text-ds-body-sm font-semibold text-success">+{(totalEnhanced || 0).toFixed(1)}</span>
                            </div>
                            <ResultHierarchyTree list={enhanced?.petsList || []} type="enhanced" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-error/20 pb-1">
                                <h4 className="text-ds-body-sm font-semibold text-error">降低体验</h4>
                                <span className="text-ds-body-sm font-semibold text-error">-{(totalReduced || 0).toFixed(1)}</span>
                            </div>
                            <ResultHierarchyTree list={reduced?.petsList || []} type="reduced" />
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
};

export default VehicleResultPanel;
