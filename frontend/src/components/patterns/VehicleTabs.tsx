import { AlertTriangle, Car } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatEnglishLabel } from '@/lib/utils';

export interface VehicleTabItem {
  id: string;
  label: string;
  hasData?: boolean;
}

interface VehicleTabsProps {
  items: VehicleTabItem[];
  value: string;
  onChange: (id: string) => void;
  onBlockedSelection?: (id: string) => void;
  className?: string;
}

export default function VehicleTabs({ items, value, onChange, onBlockedSelection, className }: VehicleTabsProps) {
  return (
    <div className={cn('rounded-control bg-surface/85 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(15,23,42,0.06)]', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => {
          const hasData = item.hasData !== false;
          const active = item.id === value;

          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (hasData) {
                  onChange(item.id);
                  return;
                }
                onBlockedSelection?.(item.id);
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-control px-3 py-1.5 text-ds-body-sm font-medium transition-all',
                active
                  ? 'bg-white text-primary shadow-[0_10px_24px_rgba(19,127,236,0.18)]'
                  : 'bg-transparent text-text-secondary hover:bg-white/85 hover:text-text-primary hover:shadow-[0_6px_14px_rgba(15,23,42,0.08)]',
                !hasData && !active && 'opacity-70'
              )}
              aria-current={active ? 'page' : undefined}
              title={hasData ? undefined : '当前车型暂无 UVA 数据'}
            >
              <Car className="h-3.5 w-3.5" />
              {formatEnglishLabel(item.label)}
              {!hasData ? (
                <Badge variant="warning" className="inline-flex items-center gap-1 px-1.5 py-0">
                  <AlertTriangle className="h-3 w-3" />
                  无数据
                </Badge>
                ) : null}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
