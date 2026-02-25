import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { pageSpring, reducedMotionTransition } from '@/lib/motion';
import ComponentStatesSection from './sections/ComponentStatesSection';
import FoundationSection from './sections/FoundationSection';
import MotionLabSection from './sections/MotionLabSection';
import PatternsSection from './sections/PatternsSection';
import ReadinessMatrixSection from './sections/ReadinessMatrixSection';
import TypographySection from './sections/TypographySection';

const navItems = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'typography', label: 'Typography' },
  { id: 'motion-lab', label: 'Motion Lab' },
  { id: 'component-states', label: 'Component States' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'readiness-matrix', label: 'Readiness Matrix' },
] as const;

export default function DesignSystemShowpage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion || !!systemReducedMotion;

  return (
    <div className="ds-page-bg min-h-screen text-text-primary">
      <header className="surface-panel-soft surface-divider-bottom sticky top-0 z-40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="space-y-2">
              <p className="text-ds-caption uppercase tracking-wide text-slate-600">ROI Design System</p>
              <h1 className="text-ds-title text-slate-900">Showpage Review v1</h1>
              <p className="text-ds-body-sm text-slate-600">Enterprise UI baseline · cleaner forms · lighter surfaces · pragmatic motion.</p>
            </div>
            <span className="surface-inset hidden rounded-control px-3 py-2 text-ds-caption text-slate-600 sm:inline-flex">
              Route: /design-system
            </span>
          </div>

          <nav aria-label="Design system sections" className="overflow-x-auto">
            <ul className="flex min-w-max gap-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="surface-inset block rounded-control px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-white hover:text-primary sm:px-3 sm:py-2 sm:text-ds-caption"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <motion.main
        className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? reducedMotionTransition : pageSpring}
      >
        <FoundationSection />
        <TypographySection />
        <MotionLabSection
          reducedMotion={reducedMotion}
          systemReducedMotion={!!systemReducedMotion}
          onReducedMotionChange={setReducedMotion}
        />
        <ComponentStatesSection />
        <PatternsSection />
        <ReadinessMatrixSection />
      </motion.main>
    </div>
  );
}
