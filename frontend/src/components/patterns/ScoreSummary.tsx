import { Gauge, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ScoreSummaryProps {
  finalScore: number;
  totalEnhanced: number;
  totalReduced: number;
  className?: string;
  lastCalculatedAt?: string;
}

function formatScore(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toFixed(1);
}

export default function ScoreSummary({
  finalScore,
  totalEnhanced,
  totalReduced,
  className,
  lastCalculatedAt
}: ScoreSummaryProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-3', className)}>
      <div className="surface-panel rounded-control p-4">
        <div className="mb-1 inline-flex items-center gap-1 text-ds-caption text-text-secondary">
          <Gauge className="h-3.5 w-3.5" />
          UVA 总分
        </div>
        <div
          className={cn(
            'text-[2rem] font-semibold leading-none tracking-tight',
            finalScore > 0 ? 'text-success' : finalScore < 0 ? 'text-error' : 'text-text-primary'
          )}
        >
          {finalScore > 0 ? '+' : ''}
          {formatScore(finalScore)}
        </div>
        {lastCalculatedAt ? (
          <div className="mt-1 text-ds-caption text-text-secondary">{new Date(lastCalculatedAt).toLocaleString()}</div>
        ) : null}
      </div>

      <div className="surface-inset rounded-control p-4">
        <div className="mb-1 inline-flex items-center gap-1 text-ds-caption text-success">
          <TrendingUp className="h-3.5 w-3.5" />
          提升体验
        </div>
        <div className="text-ds-title-sm font-semibold text-success">+{formatScore(totalEnhanced)}</div>
      </div>

      <div className="surface-inset rounded-control p-4">
        <div className="mb-1 inline-flex items-center gap-1 text-ds-caption text-error">
          <TrendingDown className="h-3.5 w-3.5" />
          降低体验
        </div>
        <div className="text-ds-title-sm font-semibold text-error">-{formatScore(totalReduced)}</div>
      </div>
    </div>
  );
}
