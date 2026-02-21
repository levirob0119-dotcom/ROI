import type { LucideIcon } from 'lucide-react';
import { Database } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyStateBlockProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export default function EmptyStateBlock({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Database
}: EmptyStateBlockProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-control bg-surface/70 px-6 py-8 text-center ring-1 ring-slate-900/6 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className="rounded-full bg-white p-3 shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
        <Icon className="h-6 w-6 text-text-secondary" />
      </div>
      <h3 className="text-ds-body font-semibold text-text-primary">{title}</h3>
      <p className="max-w-md text-ds-body-sm text-text-secondary">{description}</p>
      {actionLabel && onAction ? (
        <Button type="button" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
