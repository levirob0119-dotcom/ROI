import type { ReactNode } from 'react';

interface SectionShellProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function SectionShell({ id, title, description, children }: SectionShellProps) {
  return (
    <section id={id} aria-label={title} className="surface-panel rounded-card p-4 sm:p-6">
      <div className="space-y-2 pb-4">
        <h2 className="text-ds-title-sm text-slate-900">{title}</h2>
        <p className="text-ds-body-sm text-slate-600">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
