import type { ComponentReadinessItem } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { componentReadiness } from '../designTokens';
import { SectionShell } from './SectionShell';

const statusClassMap: Record<ComponentReadinessItem['status'], string> = {
  draft: 'surface-tint-warning text-warning',
  ready: 'surface-tint-success text-success',
  migrate: 'surface-tint-info text-info',
};

export default function ReadinessMatrixSection() {
  return (
    <SectionShell
      id="readiness-matrix"
      title="Readiness Matrix"
      description="Current component readiness for next-phase migration planning."
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {componentReadiness.map((item) => (
            <TableRow key={item.component}>
              <TableCell>{item.component}</TableCell>
              <TableCell className="text-text-secondary">{item.category}</TableCell>
              <TableCell>
                <span className={`inline-flex rounded-full px-2 py-1 text-ds-caption font-semibold ${statusClassMap[item.status]}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="text-text-secondary">{item.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionShell>
  );
}
