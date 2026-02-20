export type ReadinessStatus = 'draft' | 'ready' | 'migrate';

export interface ComponentReadinessItem {
  component: string;
  category: 'foundation' | 'form' | 'feedback' | 'navigation' | 'data-display';
  status: ReadinessStatus;
  notes: string;
}

export interface MotionPresetItem {
  id: 'micro' | 'component' | 'page';
  name: string;
  stiffness: number;
  damping: number;
  usage: string;
}
