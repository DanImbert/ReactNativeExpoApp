export type FocusArea = 'Roadmap' | 'Tuner' | 'Practice' | 'Analytics';

export type PracticePlan = {
  id: string;
  title: string;
  duration: number;
  focus: string;
  completed: boolean;
  intensity: 'Light' | 'Core' | 'Stretch';
};

export type Song = {
  id: string;
  title: string;
  level: string;
  progress: number;
  accuracy: number;
};

export type StringTarget = {
  name: string;
  target: number;
};

export type PracticeSession = {
  id: string;
  label: string;
  minutes: number;
  impact: 'Warmup' | 'Technique' | 'Songwork';
  loggedAt: string;
};
