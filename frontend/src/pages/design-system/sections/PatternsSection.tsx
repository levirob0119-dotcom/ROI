import { Bell, Database, Send } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { SectionShell } from './SectionShell';

const tableRows = [
  { metric: 'Retention uplift', value: '+4.8%', status: 'Healthy' },
  { metric: 'Feature activation', value: '62%', status: 'Tracking' },
  { metric: 'Error rate', value: '0.9%', status: 'Attention' },
];

export default function PatternsSection() {
  const { showToast, ToastComponent } = useToast();

  return (
    <SectionShell
      id="patterns"
      title="Patterns"
      description="Reusable pattern blocks for forms, data display, empty states, and feedback components."
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>Form block</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-ds-caption text-text-secondary" htmlFor="pattern-project-name">
                Project name
              </label>
              <Input id="pattern-project-name" placeholder="NIO ET5 ROI Assessment" />
            </div>
            <div className="space-y-2">
              <label className="text-ds-caption text-text-secondary" htmlFor="pattern-owner">
                Owner
              </label>
              <Input id="pattern-owner" placeholder="ROI Design Team" />
            </div>
            <div className="flex gap-2">
              <Button>Save</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>Table block</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-control border border-border">
              <table className="w-full min-w-full border-collapse">
                <thead className="bg-surface">
                  <tr>
                    <th className="border-b border-border px-3 py-2 text-left text-ds-caption font-semibold text-text-secondary">Metric</th>
                    <th className="border-b border-border px-3 py-2 text-left text-ds-caption font-semibold text-text-secondary">Value</th>
                    <th className="border-b border-border px-3 py-2 text-left text-ds-caption font-semibold text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.metric}>
                      <td className="border-b border-border px-3 py-2 text-ds-body-sm text-text-primary">{row.metric}</td>
                      <td className="border-b border-border px-3 py-2 text-ds-body-sm text-text-primary">{row.value}</td>
                      <td className="border-b border-border px-3 py-2 text-ds-body-sm text-text-secondary">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>Empty state block</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 rounded-control border border-dashed border-border bg-surface p-6 text-center">
              <Database className="text-text-secondary" />
              <p className="text-ds-body text-text-primary">No analytics configured</p>
              <p className="text-ds-body-sm text-text-secondary">Create your first scenario to start ROI estimation.</p>
              <Button variant="outline">Create scenario</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>Feedback block</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 rounded-control border border-success/30 bg-success/10 p-3 text-ds-body-sm text-success">
              <Bell size={16} /> Configuration saved successfully.
            </div>
            <div className="flex items-center gap-2 rounded-control border border-warning/30 bg-warning/10 p-3 text-ds-body-sm text-warning">
              <Bell size={16} /> Some fields still require validation.
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => showToast('Toast preview for feedback patterns', 'info')}>
                <Send className="h-4 w-4" />
                Trigger toast
              </Button>
              <Badge variant="outline">Toast + Alert</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <ToastComponent />
    </SectionShell>
  );
}
