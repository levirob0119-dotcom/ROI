import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Trash2, Check } from 'lucide-react';
import type { UVL1 } from '@/services/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { transitions } from '@/lib/motion';

import type { PetsEntry } from '@/types/analysis';

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

    const getL1SelectionCount = (l1: UVL1): { selected: number; total: number } => {
        const total = l1.l2_items.length;
        const selected = l1.l2_items.filter(l2 => entry.uvL2Names.includes(l2.name)).length;
        return { selected, total };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={transitions.normal}
        >
            <Card
                className={cn(
                    "overflow-hidden",
                    "surface-panel-soft"
                )}
            >
                {/* Header */}
                <motion.div
                    className="surface-inset flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-100/80"
                    onClick={onToggleExpand}
                    whileTap={{ scale: 0.995 }}
                >
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: entry.isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                        <span className="font-medium text-base">{entry.petsName}</span>
                        <Badge
                            variant={isEnhanced ? "success" : "destructive"}
                            className="ml-2"
                        >
                            {isEnhanced ? '+提升' : '−降低'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="surface-inset rounded-full px-2 py-1 text-xs text-muted-foreground">
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
                </motion.div>

                {/* Expanded Content - 树状 UV 列表 */}
                <AnimatePresence>
                    {entry.isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={transitions.expand}
                            className="overflow-hidden"
                        >
                            <div className="surface-panel-soft">
                                <CardContent className="p-0">
                                    {uvData.map(l1 => {
                                        const isL1Expanded = expandedL1s.has(l1.l1_id);
                                        const { selected, total } = getL1SelectionCount(l1);
                                        const hasSelection = selected > 0;

                                        return (
                                            <div key={l1.l1_id} className="mb-1 last:mb-0">
                                                {/* L1 Header */}
                                                <motion.div
                                                    className={cn("flex cursor-pointer items-center justify-between px-4 py-3 transition-colors", hasSelection ? "bg-primary/8" : "hover:bg-slate-100/70")}
                                                    onClick={() => toggleL1(l1.l1_id)}
                                                    whileTap={{ scale: 0.995 }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <motion.div
                                                            animate={{ rotate: isL1Expanded ? 90 : 0 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                        </motion.div>
                                                        <span className="text-sm font-medium">{l1.l1_name}</span>
                                                    </div>
                                                    <span className={cn(
                                                        "text-xs px-2 py-0.5 rounded-full min-w-[36px] text-center",
                                                        hasSelection
                                                            ? (isEnhanced ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive")
                                                            : "text-muted-foreground bg-slate-100"
                                                    )}>
                                                        {selected}/{total}
                                                    </span>
                                                </motion.div>

                                                {/* L2 Items */}
                                                <AnimatePresence>
                                                    {isL1Expanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={transitions.expand}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="grid grid-cols-2 gap-2 bg-white/70 px-4 py-3">
                                                                {l1.l2_items.map(l2 => {
                                                                    const isSelected = entry.uvL2Names.includes(l2.name);

                                                                    return (
                                                                        <motion.div
                                                                            key={l2.id}
                                                                            className={cn(
                                                                                "flex cursor-pointer items-center gap-2 rounded p-2 transition-all",
                                                                                isSelected
                                                                                    ? (isEnhanced
                                                                                        ? "bg-success/12 text-success shadow-[0_6px_14px_rgba(22,163,74,0.12)]"
                                                                                        : "bg-destructive/12 text-destructive shadow-[0_6px_14px_rgba(220,38,38,0.12)]")
                                                                                    : "surface-inset text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                                                                            )}
                                                                            onClick={() => onToggleUV(l2.name)}
                                                                            whileTap={{ scale: 0.98 }}
                                                                        >
                                                                            <div className={cn(
                                                                                "flex h-4 w-4 items-center justify-center rounded transition-colors shadow-[inset_0_0_0_1px_rgba(148,163,184,0.32)]",
                                                                                isSelected
                                                                                    ? (isEnhanced ? "bg-success shadow-none" : "bg-destructive shadow-none")
                                                                                    : "bg-background"
                                                                            )}>
                                                                                {isSelected && <Check className="h-3 w-3 text-white" />}
                                                                            </div>
                                                                            <span className="text-sm truncate">{l2.name}</span>
                                                                        </motion.div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
};

export default PetsEntryCard;
