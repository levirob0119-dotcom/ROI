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
            whileHover={{ y: -2 }}
        >
            <Card
                className={cn(
                    "border-l-4 overflow-hidden",
                    isEnhanced ? "border-l-success" : "border-l-destructive"
                )}
            >
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-elevated transition-colors"
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
                            {isEnhanced ? '+增强' : '−减弱'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
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
                            <div className="border-t bg-secondary/30">
                                <CardContent className="p-0">
                                    {uvData.map(l1 => {
                                        const isL1Expanded = expandedL1s.has(l1.l1_id);
                                        const { selected, total } = getL1SelectionCount(l1);
                                        const hasSelection = selected > 0;

                                        return (
                                            <div key={l1.l1_id} className="border-b last:border-b-0">
                                                {/* L1 Header */}
                                                <motion.div
                                                    className={cn(
                                                        "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors",
                                                        hasSelection ? "bg-primary/5" : "hover:bg-elevated"
                                                    )}
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
                                                            ? (isEnhanced ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")
                                                            : "text-muted-foreground bg-muted"
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
                                                            <div className="bg-background px-4 py-3 grid grid-cols-2 gap-2">
                                                                {l1.l2_items.map(l2 => {
                                                                    const isSelected = entry.uvL2Names.includes(l2.name);

                                                                    return (
                                                                        <motion.div
                                                                            key={l2.id}
                                                                            className={cn(
                                                                                "flex items-center gap-2 p-2 rounded cursor-pointer border transition-all",
                                                                                isSelected
                                                                                    ? (isEnhanced
                                                                                        ? "bg-success/10 border-success/30 text-success"
                                                                                        : "bg-destructive/10 border-destructive/30 text-destructive")
                                                                                    : "border-transparent text-muted-foreground hover:bg-elevated hover:text-foreground"
                                                                            )}
                                                                            onClick={() => onToggleUV(l2.name)}
                                                                            whileTap={{ scale: 0.98 }}
                                                                        >
                                                                            <div className={cn(
                                                                                "flex items-center justify-center w-4 h-4 rounded border transition-colors",
                                                                                isSelected
                                                                                    ? (isEnhanced ? "bg-success border-success" : "bg-destructive border-destructive")
                                                                                    : "border-muted-foreground/30 bg-background"
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
