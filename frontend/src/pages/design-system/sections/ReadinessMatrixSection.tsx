import type { ComponentReadinessItem } from '../types';
import { componentReadiness } from '../designTokens';
import { SectionShell } from './SectionShell';

const statusClassMap: Record<ComponentReadinessItem['status'], string> = {
  draft: 'bg-warning/10 text-warning border-warning/30',
  ready: 'bg-success/10 text-success border-success/30',
  migrate: 'bg-info/10 text-info border-info/30',
};

export default function ReadinessMatrixSection() {
  return (
    <SectionShell
      id="readiness-matrix"
      title="Readiness Matrix"
      description="Current component readiness for next-phase migration planning."
    >
      <div className="overflow-x-auto rounded-control border border-border">
        <table className="w-full border-collapse">
          <thead className="bg-surface">
            <tr>
              <th className="border-b border-border px-3 py-2 text-left text-ds-caption font-semibold text-text-secondary">Component</th>
              <th className="border-b border-border px-3 py-2 text-left text-ds-caption font-semibold text-text-secondary">Category</th>
              <th className="border-b border-border px-3 py-2 text-left text-ds-caption font-semibold text-text-secondary">Status</th>
              <th className="border-b border-border px-3 py-2 text-left text-ds-caption font-semibold text-text-secondary">Notes</th>
            </tr>
          </thead>
          <tbody>
            {componentReadiness.map((item) => (
              <tr key={item.component}>
                <td className="border-b border-border px-3 py-2 text-ds-body-sm text-text-primary">{item.component}</td>
                <td className="border-b border-border px-3 py-2 text-ds-body-sm text-text-secondary">{item.category}</td>
                <td className="border-b border-border px-3 py-2 text-ds-body-sm">
                  <span className={`rounded-control border px-2 py-1 text-ds-caption font-semibold ${statusClassMap[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="border-b border-border px-3 py-2 text-ds-body-sm text-text-secondary">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}
