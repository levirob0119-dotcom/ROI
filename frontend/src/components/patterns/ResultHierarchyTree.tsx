import { ChevronDown, ChevronRight, Diamond } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

interface L2Node {
  l2Name: string;
  score: number;
}

interface L1Node {
  l1Name: string;
  totalScore: number;
  l2List: L2Node[];
}

interface RequirementGroup {
  categoryName: string;
  totalScore: number;
  l1List: L1Node[];
}

export interface PetsResultNode {
  petsId: string;
  petsName: string;
  totalScore: number;
  requirementGroups?: RequirementGroup[];
}

interface ResultHierarchyTreeProps {
  list: PetsResultNode[];
  type: 'enhanced' | 'reduced';
}

function formatScore(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toFixed(1);
}

export default function ResultHierarchyTree({ list, type }: ResultHierarchyTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isEnhanced = type === 'enhanced';

  const sortedList = useMemo(
    () => [...(Array.isArray(list) ? list : [])].sort((first, second) => (second?.totalScore || 0) - (first?.totalScore || 0)),
    [list]
  );

  if (sortedList.length === 0) {
    return <p className="text-ds-body-sm text-text-secondary">暂无结构化结果。</p>;
  }

  return (
    <div className="space-y-3">
      {sortedList.map((pets, index) => {
        const petsId = pets?.petsId || `pets-${pets?.petsName || index}`;
        const open = expanded[petsId] ?? true;
        const requirementGroups = Array.isArray(pets?.requirementGroups) ? pets.requirementGroups : [];
        return (
          <article
            key={petsId}
            className={cn(
              'overflow-hidden rounded-control shadow-[0_10px_20px_rgba(15,23,42,0.06)]',
              isEnhanced ? 'bg-success/8' : 'bg-error/8'
            )}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 text-left"
              onClick={() => setExpanded((prev) => ({ ...prev, [petsId]: !open }))}
            >
              <span className="inline-flex items-center gap-2 text-ds-body-sm font-semibold text-text-primary">
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Diamond className={cn('h-3.5 w-3.5', isEnhanced ? 'text-success' : 'text-error')} />
                {pets?.petsName || '未命名维度'}
              </span>
              <span className={cn('text-ds-body-sm font-semibold', isEnhanced ? 'text-success' : 'text-error')}>
                {isEnhanced ? '+' : '-'}{formatScore(pets?.totalScore || 0)}
              </span>
            </button>

            {open ? (
              <div className="space-y-3 bg-white/85 px-3 py-3">
                {requirementGroups.length === 0 ? (
                  <div className="rounded-control bg-surface px-3 py-2 text-ds-body-sm text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    该结果缺少层级明细，建议重新测算后查看完整结构。
                  </div>
                ) : null}
                {requirementGroups.map((group) => (
                  <section key={group.categoryName} className="space-y-2 rounded-control bg-white p-3 shadow-[0_8px_16px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between">
                      <h5 className="text-ds-body-sm font-semibold text-text-primary">{group.categoryName}</h5>
                      <span className={cn('text-ds-caption font-semibold', isEnhanced ? 'text-success' : 'text-error')}>
                        {isEnhanced ? '+' : '-'}{formatScore(group.totalScore)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {(group.l1List || []).map((l1) => (
                        <div key={l1.l1Name} className="rounded-control bg-surface px-2 py-2">
                          <div className="mb-1 flex items-center justify-between text-ds-caption text-text-secondary">
                            <span>{l1.l1Name}</span>
                            <span className={cn('font-semibold', isEnhanced ? 'text-success' : 'text-error')}>
                              {formatScore(l1.totalScore)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {(l1.l2List || [])
                              .filter((l2) => l2.score !== 0)
                              .map((l2) => (
                                <div key={l2.l2Name} className="flex items-center justify-between text-ds-caption text-text-secondary">
                                  <span className="truncate pr-3">{l2.l2Name}</span>
                                  <span>{formatScore(l2.score)}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
