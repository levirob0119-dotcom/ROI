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
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-ds-caption uppercase tracking-wide text-text-secondary">ROI Design System</p>
              <h1 className="text-ds-title text-text-primary">Showpage Review v1</h1>
              <p className="text-ds-body-sm text-text-secondary">Light mode · NIO blue palette · modular type scale 1.25 · spring motion.</p>
            </div>
            <span className="rounded-control border border-border bg-surface px-3 py-2 text-ds-caption text-text-secondary">
              Route: /design-system
            </span>
          </div>

          <nav aria-label="Design system sections" className="overflow-x-auto">
            <ul className="flex min-w-max gap-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block rounded-control border border-border bg-white px-3 py-2 text-ds-caption text-text-secondary transition-colors hover:border-primary hover:text-primary"
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
        className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
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
