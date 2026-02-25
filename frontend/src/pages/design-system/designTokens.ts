import type { ComponentReadinessItem, MotionPresetItem } from './types';

export const designTokens = {
  colors: [
    { name: 'Primary', value: '#137FEC', use: 'Brand and key actions' },
    { name: 'Primary Hover', value: '#1170D2', use: 'Hover state for primary actions' },
    { name: 'Canvas', value: '#EEF2F7', use: 'App-level page background' },
    { name: 'Surface 1', value: 'rgba(255,255,255,0.96)', use: 'Primary panels and cards' },
    { name: 'Surface 2', value: 'rgba(255,255,255,0.82)', use: 'Secondary containers and tabs' },
    { name: 'Surface 3', value: 'rgba(246,249,253,0.95)', use: 'Inputs and inset groups' },
    { name: 'Line Subtle', value: 'rgba(148,163,184,0.18)', use: 'Dividers and control outlines' },
    { name: 'Text Primary', value: '#0F172A', use: 'Main text and titles' },
    { name: 'Text Secondary', value: '#475569', use: 'Supporting text' },
    { name: 'Success', value: '#16A34A', use: 'Positive feedback' },
    { name: 'Warning', value: '#D97706', use: 'Caution feedback' },
    { name: 'Error', value: '#DC2626', use: 'Error feedback' },
    { name: 'Info', value: '#0EA5E9', use: 'Informational feedback' },
  ],
  typography: [
    { token: 'label', className: 'ui-label', size: 12, lineHeight: 18, weight: 600 },
    { token: 'caption', className: 'text-ds-caption', size: 12, lineHeight: 20, weight: 400 },
    { token: 'body-sm', className: 'text-ds-body-sm', size: 14, lineHeight: 22, weight: 400 },
    { token: 'body', className: 'text-ds-body', size: 16, lineHeight: 24, weight: 400 },
    { token: 'section-title', className: 'ui-h2', size: 22, lineHeight: 30, weight: 600 },
    { token: 'page-title', className: 'ui-h1', size: 34, lineHeight: 40, weight: 700 },
  ],
  spacing: [4, 8, 12, 16, 24, 32, 48],
  radius: [
    { token: 'control', value: 8, description: 'Inputs, buttons, chips' },
    { token: 'card', value: 12, description: 'Cards and pattern containers' },
  ],
  shadows: [
    { token: 'ui-shadow-sm', value: '0 6px 14px rgba(15, 23, 42, 0.05)' },
    { token: 'ui-shadow-md', value: '0 14px 32px rgba(15, 23, 42, 0.08)' },
    { token: 'ui-shadow-lg', value: '0 20px 44px rgba(15, 23, 42, 0.12)' },
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
  { component: 'Button', category: 'form', status: 'ready', notes: 'Primary, secondary and outline hierarchy rebuilt' },
  { component: 'Input', category: 'form', status: 'ready', notes: 'Default and focus states moved to low-noise surfaces' },
  { component: 'Textarea', category: 'form', status: 'ready', notes: 'Unified multiline input states for production forms' },
  { component: 'Select', category: 'form', status: 'ready', notes: 'Aligned with input shell and focus language' },
  { component: 'Toggle', category: 'form', status: 'ready', notes: 'Switch track and thumb rebuilt with clearer affordance' },
  { component: 'Radio Group', category: 'form', status: 'ready', notes: 'Selection card hierarchy rebuilt' },
  { component: 'Slider', category: 'form', status: 'ready', notes: 'Track/thumb visual weight normalized' },
  { component: 'Card', category: 'data-display', status: 'ready', notes: 'Layer-based shadows and panel semantics applied' },
  { component: 'Badge', category: 'feedback', status: 'ready', notes: 'Tonal pill system with lower contrast defaults' },
  { component: 'Toast', category: 'feedback', status: 'ready', notes: 'Shared hook and component split; stable API in production chain' },
  { component: 'Dialog', category: 'navigation', status: 'ready', notes: 'Used by project modals and account actions' },
  { component: 'Confirm Dialog', category: 'navigation', status: 'ready', notes: 'Standard destructive action confirmation pattern' },
  { component: 'Section Layout', category: 'foundation', status: 'ready', notes: 'Foundation for showpage' },
  { component: 'Table Pattern', category: 'data-display', status: 'ready', notes: 'Promoted to reusable table component' },
  { component: 'Navigation Anchor', category: 'navigation', status: 'draft', notes: 'Can be extracted after review' },
];
