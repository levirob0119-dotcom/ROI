import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { SectionShell } from './SectionShell';

export default function ComponentStatesSection() {
  return (
    <SectionShell
      id="component-states"
      title="Component States"
      description="State matrix for core controls with default, focus, disabled, loading, and error examples."
    >
      <div className="space-y-4 rounded-control border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
          <Button>Default</Button>
          <Button className="bg-primary-hover">Hover</Button>
          <Button className="ring-2 ring-ring ring-offset-2">Focus</Button>
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Loader2 className="animate-spin" />
            Loading
          </Button>
          <Button variant="destructive">Error</Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-ds-caption text-text-secondary" htmlFor="input-default">
              Input default
            </label>
            <Input id="input-default" placeholder="Default input" />
          </div>

          <div className="space-y-2">
            <label className="text-ds-caption text-text-secondary" htmlFor="input-focus-sim">
              Input focus simulation
            </label>
            <Input id="input-focus-sim" className="ring-2 ring-ring ring-offset-2" defaultValue="Focused input" />
          </div>

          <div className="space-y-2">
            <label className="text-ds-caption text-text-secondary" htmlFor="input-error">
              Input error
            </label>
            <Input id="input-error" className="border-error focus-visible:ring-error" defaultValue="Validation failed" aria-invalid="true" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 rounded-control border border-border bg-white p-3">
            <p className="text-ds-caption text-text-secondary">Toggle</p>
            <Toggle aria-label="state toggle" />
          </div>

          <div className="space-y-2 rounded-control border border-border bg-white p-3">
            <p className="text-ds-caption text-text-secondary">Toggle disabled</p>
            <Toggle aria-label="state toggle disabled" disabled />
          </div>

          <div className="space-y-2 rounded-control border border-border bg-white p-3">
            <p className="text-ds-caption text-text-secondary">Radio</p>
            <RadioGroup
              name="ds-state-radio"
              value="performance"
              options={[
                { value: 'must-be', label: 'Must-be' },
                { value: 'performance', label: 'Performance' },
              ]}
            />
          </div>

          <div className="space-y-2 rounded-control border border-border bg-white p-3">
            <p className="text-ds-caption text-text-secondary">Slider</p>
            <Slider value={65} onChange={() => undefined} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge className="bg-success text-white">Success</Badge>
          <Badge className="bg-warning text-white">Warning</Badge>
          <Badge className="bg-error text-white">Error</Badge>
        </div>
      </div>
    </SectionShell>
  );
}
