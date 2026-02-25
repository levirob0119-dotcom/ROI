import { designTokens } from '../designTokens';
import { SectionShell } from './SectionShell';

function ColorSwatch({ name, value, use }: { name: string; value: string; use: string }) {
  return (
    <div className="surface-panel-soft rounded-control p-4">
      <div className="surface-inset h-16 rounded-control" style={{ backgroundColor: value }} />
      <div className="space-y-1 pt-3">
        <p className="text-ds-body-sm font-semibold text-text-primary">{name}</p>
        <p className="text-ds-caption text-text-secondary">{value}</p>
        <p className="text-ds-caption text-text-secondary">{use}</p>
      </div>
    </div>
  );
}

export default function FoundationSection() {
  return (
    <SectionShell
      id="foundation"
      title="Foundation"
      description="Core visual tokens for color, spacing, radius, and shadows."
    >
      <div className="space-y-3">
        <h3 className="text-ds-body font-semibold text-text-primary">Color palette</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {designTokens.colors.map((item) => (
            <ColorSwatch key={item.name} name={item.name} value={item.value} use={item.use} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="surface-inset space-y-3 rounded-control p-4">
          <h3 className="text-ds-body font-semibold text-text-primary">Spacing scale</h3>
          <ul className="space-y-2">
            {designTokens.spacing.map((space) => (
              <li key={space} className="flex items-center justify-between">
                <span className="text-ds-caption text-text-secondary">{space}px</span>
                <span className="surface-panel-soft rounded-control text-ds-caption text-text-secondary" style={{ width: `${space}px`, height: '12px' }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-inset space-y-3 rounded-control p-4">
          <h3 className="text-ds-body font-semibold text-text-primary">Radius</h3>
          <div className="space-y-3">
            {designTokens.radius.map((radius) => (
              <div key={radius.token} className="space-y-1">
                <div className="surface-panel-soft h-12" style={{ borderRadius: `${radius.value}px` }} />
                <p className="text-ds-caption text-text-secondary">
                  {radius.token}: {radius.value}px - {radius.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-inset space-y-3 rounded-control p-4">
          <h3 className="text-ds-body font-semibold text-text-primary">Shadows</h3>
          <div className="space-y-3">
            {designTokens.shadows.map((shadow) => (
              <div key={shadow.token} className="space-y-1">
                <div className="surface-panel-soft h-12 rounded-control" style={{ boxShadow: shadow.value }} />
                <p className="text-ds-caption text-text-secondary">
                  {shadow.token}: {shadow.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
