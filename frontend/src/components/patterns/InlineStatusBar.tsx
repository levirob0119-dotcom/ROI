import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface InlineStatusBarProps {
  tone?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

const toneMap = {
  info: {
    root: 'bg-info/10 text-info ring-1 ring-info/25 shadow-[0_6px_18px_rgba(14,165,233,0.12)]',
    description: 'text-text-secondary',
    Icon: Info
  },
  success: {
    root: 'bg-success/10 text-success ring-1 ring-success/25 shadow-[0_6px_18px_rgba(22,163,74,0.12)]',
    description: 'text-text-secondary',
    Icon: CheckCircle2
  },
  warning: {
    root: 'bg-warning/10 text-warning ring-1 ring-warning/25 shadow-[0_6px_18px_rgba(217,119,6,0.12)]',
    description: 'text-text-secondary',
    Icon: AlertTriangle
  },
  error: {
    root: 'bg-error/10 text-error ring-1 ring-error/25 shadow-[0_6px_18px_rgba(220,38,38,0.12)]',
    description: 'text-text-secondary',
    Icon: XCircle
  }
} as const;

export default function InlineStatusBar({
  tone = 'info',
  title,
  description,
  actions,
  className
}: InlineStatusBarProps) {
  const config = toneMap[tone];
  const Icon = config.Icon;

  return (
    <div className={cn('rounded-control px-3 py-2', config.root, className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1 text-ds-body-sm font-semibold">
            <Icon className="h-4 w-4" />
            {title}
          </p>
          {description ? <p className={cn('text-ds-caption', config.description)}>{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}
