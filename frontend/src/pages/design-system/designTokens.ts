import type { ComponentReadinessItem, MotionPresetItem } from './types';

export const designTokens = {
  colors: [
    { name: 'Primary', value: '#137FEC', use: 'Brand and key actions' },
    { name: 'Primary Hover', value: '#1170D2', use: 'Hover state for primary actions' },
    { name: 'Background', value: '#FFFFFF', use: 'Page background' },
    { name: 'Surface', value: '#F8FAFC', use: 'Section and panel background' },
    { name: 'Border', value: '#E2E8F0', use: 'Dividers and control borders' },
    { name: 'Text Primary', value: '#0F172A', use: 'Main text and titles' },
    { name: 'Text Secondary', value: '#475569', use: 'Supporting text' },
    { name: 'Success', value: '#16A34A', use: 'Positive feedback' },
    { name: 'Warning', value: '#D97706', use: 'Caution feedback' },
    { name: 'Error', value: '#DC2626', use: 'Error feedback' },
    { name: 'Info', value: '#0EA5E9', use: 'Informational feedback' },
  ],
  typography: [
    { token: 'caption', className: 'text-ds-caption', size: 12, lineHeight: 20, weight: 400 },
    { token: 'body-sm', className: 'text-ds-body-sm', size: 14, lineHeight: 20, weight: 400 },
    { token: 'body', className: 'text-ds-body', size: 16, lineHeight: 24, weight: 400 },
    { token: 'title-sm', className: 'text-ds-title-sm', size: 20, lineHeight: 28, weight: 600 },
    { token: 'title', className: 'text-ds-title', size: 25, lineHeight: 32, weight: 600 },
    { token: 'h2', className: 'text-ds-h2', size: 31, lineHeight: 40, weight: 700 },
    { token: 'h1', className: 'text-ds-h1', size: 39, lineHeight: 48, weight: 700 },
  ],
  spacing: [4, 8, 12, 16, 24, 32, 48],
  radius: [
    { token: 'control', value: 8, description: 'Inputs, buttons, chips' },
    { token: 'card', value: 12, description: 'Cards and pattern containers' },
  ],
  shadows: [
    { token: 'ds-sm', value: '0 1px 2px rgba(15, 23, 42, 0.06)' },
    { token: 'ds-md', value: '0 4px 12px rgba(15, 23, 42, 0.08)' },
  ],
} as const;

export const motionPresets: MotionPresetItem[] = [
  {
    id: 'micro',
    name: 'Micro Interaction',
    stiffness: 400,
    damping: 25,
    usage: 'Hover, tap, and button press feedback',
  },
  {
    id: 'component',
    name: 'Component Feedback',
    stiffness: 260,
    damping: 20,
    usage: 'Dialog, popover, toast, and local transitions',
  },
  {
    id: 'page',
    name: 'Page Transition',
    stiffness: 100,
    damping: 20,
    usage: 'Route and layout-level transitions',
  },
];

export const componentReadiness: ComponentReadinessItem[] = [
  { component: 'Button', category: 'form', status: 'ready', notes: 'Variant cleanup only' },
  { component: 'Input', category: 'form', status: 'ready', notes: 'Token alignment complete' },
  { component: 'Toggle', category: 'form', status: 'migrate', notes: 'Migrate to shared field wrapper' },
  { component: 'Radio Group', category: 'form', status: 'migrate', notes: 'Needs keyboard behavior checks' },
  { component: 'Slider', category: 'form', status: 'migrate', notes: 'Needs consistent focus and thumb states' },
  { component: 'Card', category: 'data-display', status: 'ready', notes: 'Matches card radius and shadow' },
  { component: 'Badge', category: 'feedback', status: 'ready', notes: 'Semantic color map pending' },
  { component: 'Toast', category: 'feedback', status: 'migrate', notes: 'Integrate with shared feedback patterns' },
  { component: 'Section Layout', category: 'foundation', status: 'ready', notes: 'Foundation for showpage' },
  { component: 'Table Pattern', category: 'data-display', status: 'draft', notes: 'Promote to reusable table component next phase' },
  { component: 'Navigation Anchor', category: 'navigation', status: 'draft', notes: 'Can be extracted after review' },
];
