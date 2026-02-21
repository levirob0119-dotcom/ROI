import type { LucideIcon } from 'lucide-react';
import { Database } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateBlockProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  iconStrokeWidth?: number;
  iconClassName?: string;
  iconWrapperClassName?: string;
  containerClassName?: string;
  actionVariant?: ButtonProps['variant'];
  actionSize?: ButtonProps['size'];
  actionClassName?: string;
}

export default function EmptyStateBlock({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Database,
  iconStrokeWidth = 2,
  iconClassName,
  iconWrapperClassName,
  containerClassName,
  actionVariant = 'outline',
  actionSize = 'default',
  actionClassName
}: EmptyStateBlockProps) {
  return (
    <div className={cn(
      'flex flex-col items-center gap-3 rounded-control bg-surface/70 px-6 py-8 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]',
      containerClassName
    )}>
      <div className={cn(
        'rounded-full bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.12)]',
        iconWrapperClassName
      )}>
        <Icon className={cn('h-7 w-7 text-text-secondary', iconClassName)} strokeWidth={iconStrokeWidth} />
      </div>
      {title ? <h3 className="text-ds-body font-semibold text-text-primary">{title}</h3> : null}
      {description ? <p className="max-w-md text-ds-body-sm text-text-secondary">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button type="button" variant={actionVariant} size={actionSize} className={actionClassName} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
