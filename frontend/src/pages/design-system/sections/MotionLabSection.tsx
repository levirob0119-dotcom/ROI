import { motion } from 'framer-motion';

import { Toggle } from '@/components/ui/toggle';
import { componentSpring, microSpring, pageSpring, reducedMotionTransition } from '@/lib/motion';
import { motionPresets } from '../designTokens';
import { SectionShell } from './SectionShell';

interface MotionLabSectionProps {
  reducedMotion: boolean;
  systemReducedMotion: boolean;
  onReducedMotionChange: (value: boolean) => void;
}

const springById = {
  micro: microSpring,
  component: componentSpring,
  page: pageSpring,
};

export default function MotionLabSection({
  reducedMotion,
  systemReducedMotion,
  onReducedMotionChange
}: MotionLabSectionProps) {
  const shouldReduce = reducedMotion || systemReducedMotion;

  return (
    <SectionShell
      id="motion-lab"
      title="Motion Lab"
      description="Three spring layers with a reduced-motion simulation switch."
    >
      <div className="surface-inset flex flex-col gap-4 rounded-control p-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-ds-body font-semibold text-text-primary">Reduced motion simulation</p>
          <p className="text-ds-body-sm text-text-secondary" data-testid="reduced-motion-status">
            Reduced motion: {shouldReduce ? 'On' : 'Off'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ds-caption text-text-secondary">Off</span>
          <Toggle checked={reducedMotion} onCheckedChange={onReducedMotionChange} aria-label="Toggle reduced motion" />
          <span className="text-ds-caption text-text-secondary">On</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {motionPresets.map((preset) => {
          const transition = shouldReduce ? reducedMotionTransition : springById[preset.id];
          return (
            <div key={preset.id} className="surface-panel-soft rounded-control p-4">
              <div className="space-y-1 pb-3">
                <p className="text-ds-body font-semibold text-text-primary">{preset.name}</p>
                <p className="text-ds-caption text-text-secondary">stiffness {preset.stiffness} · damping {preset.damping}</p>
                <p className="text-ds-caption text-text-secondary">{preset.usage}</p>
              </div>

              <div className="surface-inset rounded-control p-3">
                <motion.div
                  data-testid={`motion-sample-${preset.id}`}
                  data-reduced-motion={shouldReduce ? 'true' : 'false'}
                  className="h-3 w-12 rounded-full bg-primary"
                  initial={{ x: 0 }}
                  animate={{ x: 96 }}
                  transition={transition}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
