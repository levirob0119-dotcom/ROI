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
    root: 'surface-panel-soft',
    iconWrap: 'bg-info/12 text-info',
    title: 'text-info',
    description: 'text-slate-600',
    Icon: Info
  },
  success: {
    root: 'surface-panel-soft',
    iconWrap: 'bg-success/12 text-success',
    title: 'text-success',
    description: 'text-slate-600',
    Icon: CheckCircle2
  },
  warning: {
    root: 'surface-panel-soft',
    iconWrap: 'bg-warning/12 text-warning',
    title: 'text-warning',
    description: 'text-slate-600',
    Icon: AlertTriangle
  },
  error: {
    root: 'surface-panel-soft',
    iconWrap: 'bg-error/12 text-error',
    title: 'text-error',
    description: 'text-slate-600',
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
    <div className={cn('rounded-control px-4 py-3', config.root, className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className={cn('inline-flex items-center gap-2 text-ds-body-sm font-semibold', config.title)}>
            <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full', config.iconWrap)}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            {title}
          </p>
          {description ? <p className={cn('text-ds-caption', config.description)}>{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}
