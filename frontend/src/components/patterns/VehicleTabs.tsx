import { Car } from 'lucide-react';
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
  className?: string;
}

export default function VehicleTabs({ items, value, onChange, className }: VehicleTabsProps) {
  return (
    <div className={cn('surface-panel rounded-card p-2', className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((item) => {
          const hasData = item.hasData !== false;
          const active = item.id === value;

          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(item.id)}
              disabled={!hasData}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-control px-3 py-2 text-ds-body-sm font-medium transition-[background-color,color,box-shadow]',
                active && hasData
                  ? 'bg-primary text-white shadow-[0_8px_18px_rgba(19,127,236,0.26)]'
                  : 'text-text-secondary hover:bg-slate-100/90 hover:text-text-primary',
                !hasData && 'text-slate-400 hover:bg-transparent hover:text-slate-400'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Car className="h-3.5 w-3.5" />
              {formatEnglishLabel(item.label)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
