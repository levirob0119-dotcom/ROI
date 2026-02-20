import { describe, expect, it } from 'vitest';

import { componentReadiness, designTokens, motionPresets } from './designTokens';

describe('designTokens', () => {
  it('contains required color tokens', () => {
    const colorMap = new Map(designTokens.colors.map((item) => [item.name, item.value]));

    expect(colorMap.get('Primary')).toBe('#137FEC');
    expect(colorMap.get('Primary Hover')).toBe('#1170D2');
    expect(colorMap.get('Background')).toBe('#FFFFFF');
    expect(colorMap.get('Surface')).toBe('#F8FAFC');
    expect(colorMap.get('Success')).toBe('#16A34A');
    expect(colorMap.get('Warning')).toBe('#D97706');
    expect(colorMap.get('Error')).toBe('#DC2626');
    expect(colorMap.get('Info')).toBe('#0EA5E9');
  });

  it('enforces spacing whitelist', () => {
    expect(designTokens.spacing).toEqual([4, 8, 12, 16, 24, 32, 48]);
  });

  it('defines the expected modular typography scale', () => {
    const sizes = designTokens.typography.map((item) => item.size);
    expect(sizes).toEqual([12, 14, 16, 20, 25, 31, 39]);
  });

  it('provides all three motion presets and readiness data', () => {
    expect(motionPresets.map((item) => item.id)).toEqual(['micro', 'component', 'page']);
    expect(componentReadiness.length).toBeGreaterThan(0);
  });
});
