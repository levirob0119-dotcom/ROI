import type { ReactNode } from 'react';

interface SectionShellProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function SectionShell({ id, title, description, children }: SectionShellProps) {
  return (
    <section id={id} aria-label={title} className="rounded-card border border-border bg-white p-6 shadow-ds-sm">
      <div className="space-y-2 pb-4">
        <h2 className="text-ds-title-sm text-text-primary">{title}</h2>
        <p className="text-ds-body-sm text-text-secondary">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
