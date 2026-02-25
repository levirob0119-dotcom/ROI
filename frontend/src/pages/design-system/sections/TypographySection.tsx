import { designTokens } from '../designTokens';
import { SectionShell } from './SectionShell';

export default function TypographySection() {
  return (
    <SectionShell
      id="typography"
      title="Typography"
      description="Modular scale 1.25 with fixed line-height rhythm and bilingual samples."
    >
      <div className="surface-inset space-y-4 rounded-control p-4">
        {designTokens.typography.map((token) => (
          <div key={token.token} className="surface-divider-bottom grid grid-cols-1 gap-2 pb-3 last:border-b-0 last:pb-0 md:grid-cols-3 md:items-center">
            <div>
              <p className="text-ds-body-sm font-semibold text-text-primary">{token.token}</p>
              <p className="text-ds-caption text-text-secondary">
                {token.size}/{token.lineHeight}px · weight {token.weight}
              </p>
            </div>
            <p className={`${token.className} text-text-primary`}>
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className={`${token.className} text-text-secondary`}>蔚来 ROI 设计系统正在验证排版节奏与可读性。</p>
          </div>
        ))}
      </div>

      <div className="surface-panel-soft rounded-control p-4">
        <p className="text-ds-body-sm text-text-secondary">Typography guidance</p>
        <ul className="space-y-2 pt-3 text-ds-body-sm text-text-secondary">
          <li>Use semantic classes only: text-ds-caption to text-ds-h1.</li>
          <li>Do not use arbitrary text sizes in showpage implementation.</li>
          <li>Line-heights are tied to 4px and 8px rhythm for vertical consistency.</li>
        </ul>
      </div>
    </SectionShell>
  );
}
