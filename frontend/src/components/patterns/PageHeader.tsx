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
    <header className={cn('rounded-card bg-white/95 px-5 py-4 shadow-[0_14px_36px_rgba(15,23,42,0.1)]', className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-ds-title text-text-primary">{title}</h1>
            {status && <Badge variant={status.tone ?? 'secondary'}>{status.label}</Badge>}
          </div>
          {description ? <p className="text-ds-body-sm text-text-secondary">{description}</p> : null}
          {meta ? <div className="text-ds-caption text-text-secondary">{meta}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
