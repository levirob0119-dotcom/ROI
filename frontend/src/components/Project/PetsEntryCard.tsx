import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Check } from 'lucide-react';
import type { UVL1 } from '@/services/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Use utility for class merging

export interface PetsEntry {
    petsId: string;
    petsName: string;
    type: 'enhanced' | 'reduced';
    uvL2Names: string[];
    isExpanded: boolean;
}

interface PetsEntryCardProps {
    entry: PetsEntry;
    uvData: UVL1[];
    onToggleExpand: () => void;
    onDelete: () => void;
    onToggleUV: (uvL2Name: string) => void;
}

const PetsEntryCard: React.FC<PetsEntryCardProps> = ({
    entry,
    uvData,
    onToggleExpand,
    onDelete,
    onToggleUV
}) => {
    // 使用 number 类型匹配 l1_id，默认全部折叠
    const [expandedL1s, setExpandedL1s] = useState<Set<number>>(new Set());

    const isEnhanced = entry.type === 'enhanced';

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
        <Card
            className={cn(
                "mb-3 border-l-4 transition-all duration-200 hover:shadow-md",
                isEnhanced ? "border-l-emerald-500" : "border-l-rose-500"
            )}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg"
                onClick={onToggleExpand}
            >
                <div className="flex items-center gap-2">
                    {entry.isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-base">{entry.petsName}</span>
                    <Badge
                        variant="outline"
                        className={cn(
                            "ml-2 text-xs font-normal border-none",
                            isEnhanced
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        )}
                    >
                        {isEnhanced ? '+增强' : '−减弱'}
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-sm">
                        {entry.uvL2Names.length} 个 UV
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Expanded Content - 树状 UV 列表 */}
            {entry.isExpanded && (
                <div className="border-t bg-card/50">
                    <CardContent className="p-0">
                        {uvData.map(l1 => {
                            const isL1Expanded = expandedL1s.has(l1.l1_id);
                            const { selected, total } = getL1SelectionCount(l1);
                            const hasSelection = selected > 0;

                            return (
                                <div key={l1.l1_id} className="border-b last:border-b-0">
                                    {/* L1 Header - 可折叠 */}
                                    <div
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent/30 transition-colors",
                                            hasSelection && "bg-accent/20"
                                        )}
                                        onClick={() => toggleL1(l1.l1_id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isL1Expanded ? (
                                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            <span className="text-sm font-medium">{l1.l1_name}</span>
                                        </div>
                                        <span className={cn(
                                            "text-xs px-1.5 py-0.5 rounded-full min-w-[32px] text-center",
                                            hasSelection
                                                ? (isEnhanced ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400")
                                                : "text-muted-foreground bg-secondary"
                                        )}>
                                            {selected}/{total}
                                        </span>
                                    </div>

                                    {/* L2 Items */}
                                    {isL1Expanded && (
                                        <div className="bg-secondary/20 px-4 py-2 grid grid-cols-2 gap-2">
                                            {l1.l2_items.map(l2 => {
                                                const isSelected = entry.uvL2Names.includes(l2.name);

                                                return (
                                                    <div
                                                        key={l2.id}
                                                        className={cn(
                                                            "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200 border border-transparent",
                                                            "hover:bg-background hover:shadow-sm",
                                                            isSelected
                                                                ? (isEnhanced
                                                                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-100"
                                                                    : "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-100")
                                                                : "text-muted-foreground"
                                                        )}
                                                        onClick={() => onToggleUV(l2.name)}
                                                    >
                                                        <div className={cn(
                                                            "flex items-center justify-center w-4 h-4 rounded border transition-colors",
                                                            isSelected
                                                                ? (isEnhanced ? "bg-emerald-500 border-emerald-500" : "bg-rose-500 border-rose-500")
                                                                : "border-muted-foreground/30 bg-background"
                                                        )}>
                                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                                        </div>
                                                        <span className="text-sm">{l2.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </div>
            )}
        </Card>
    );
};

export default PetsEntryCard;
