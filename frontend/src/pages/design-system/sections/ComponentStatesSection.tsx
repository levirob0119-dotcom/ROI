import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { SectionShell } from './SectionShell';

export default function ComponentStatesSection() {
  return (
    <SectionShell
      id="component-states"
      title="Component States"
      description="State matrix for core controls with default, focus, disabled, loading, and error examples."
    >
      <div className="surface-panel-soft space-y-6 rounded-card p-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Button>Default</Button>
          <Button className="bg-primary-hover text-white">Hover</Button>
          <Button className="shadow-[0_0_0_4px_rgba(19,127,236,0.14)]">Focus</Button>
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Loader2 className="animate-spin" />
            Loading
          </Button>
          <Button variant="destructive">Error</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="surface-inset space-y-4 rounded-control p-4">
            <p className="text-ds-body-sm font-semibold text-slate-800">Form Controls</p>
            <div className="space-y-2">
              <label className="text-ds-caption text-slate-600" htmlFor="input-default">
                Input default
              </label>
              <Input id="input-default" placeholder="Default input" />
            </div>
            <div className="space-y-2">
              <label className="text-ds-caption text-slate-600" htmlFor="input-focus-sim">
                Input focus simulation
              </label>
              <Input
                id="input-focus-sim"
                className="bg-white shadow-[inset_0_0_0_1px_rgba(100,116,139,0.36),0_0_0_4px_rgba(19,127,236,0.14)]"
                defaultValue="Focused input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-ds-caption text-slate-600" htmlFor="input-error">
                Input error
              </label>
              <Input id="input-error" defaultValue="Validation failed" aria-invalid="true" />
            </div>
            <div className="space-y-2">
              <label className="text-ds-caption text-slate-600" htmlFor="component-select">
                Select
              </label>
              <Select
                id="component-select"
                placeholder="请选择"
                value="performance"
                onValueChange={() => undefined}
                options={[
                  { value: 'must-be', label: '必备型' },
                  { value: 'performance', label: '期望型' },
                  { value: 'attractive', label: '魅力型' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-ds-caption text-slate-600" htmlFor="component-textarea">
                Textarea
              </label>
              <Textarea id="component-textarea" placeholder="补充说明..." defaultValue="更克制的边框和阴影，更适合 B 端密集场景。" />
            </div>
          </div>

          <div className="surface-inset space-y-4 rounded-control p-4">
            <p className="text-ds-body-sm font-semibold text-slate-800">Selection Controls</p>
            <div className="space-y-2">
              <p className="text-ds-caption text-slate-600">Checkbox</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <Checkbox defaultChecked aria-label="启用自动保存" />
                  启用自动保存
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <Checkbox aria-label="通知负责人" />
                  通知负责人
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-ds-caption text-slate-600">Toggle</p>
              <div className="flex items-center gap-3">
                <Toggle aria-label="state toggle" />
                <Toggle aria-label="state toggle disabled" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-ds-caption text-slate-600">Radio</p>
              <RadioGroup
                name="ds-state-radio"
                value="performance"
                options={[
                  { value: 'must-be', label: 'Must-be' },
                  { value: 'performance', label: 'Performance' },
                  { value: 'attractive', label: 'Attractive' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <p className="text-ds-caption text-slate-600">Slider</p>
              <Slider value={65} onChange={() => undefined} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Error</Badge>
        </div>
      </div>
    </SectionShell>
  );
}
