import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderStatus {
  label: string;
  tone?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
}

interface PageHeaderProps {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  status?: HeaderStatus;
  className?: string;
}

export default function PageHeader({ title, description, meta, actions, status, className }: PageHeaderProps) {
  return (
    <header className={cn('surface-panel rounded-card px-5 py-5 sm:px-6', className)}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="ui-h1 text-text-primary">{title}</h1>
            {status && <Badge variant={status.tone ?? 'secondary'}>{status.label}</Badge>}
          </div>
          {description ? <p className="max-w-4xl text-[15px] leading-6 text-text-secondary">{description}</p> : null}
          {meta ? <div className="text-sm text-text-secondary">{meta}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2 lg:pt-1">{actions}</div> : null}
      </div>
    </header>
  );
}
