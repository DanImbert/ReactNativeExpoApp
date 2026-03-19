import type { PracticePlan, PracticeSession, Song, StringTarget } from '../types/app';

export const initialPlans: PracticePlan[] = [
  {
    id: 'p1',
    title: 'Fingerstyle warm-up',
    duration: 12,
    focus: 'Technique',
    completed: false,
    intensity: 'Core',
  },
  {
    id: 'p2',
    title: 'Scale run (C major)',
    duration: 15,
    focus: 'Speed',
    completed: true,
    intensity: 'Stretch',
  },
  {
    id: 'p3',
    title: 'Chord transitions under tempo',
    duration: 10,
    focus: 'Timing',
    completed: false,
    intensity: 'Light',
  },
];

export const initialSongs: Song[] = [
  { id: '1', title: 'Nothing Else Matters', level: 'Intermediate', progress: 60, accuracy: 84 },
  { id: '2', title: 'Wonderwall', level: 'Beginner', progress: 90, accuracy: 93 },
  { id: '3', title: 'Hotel California', level: 'Advanced', progress: 35, accuracy: 71 },
];

export const strings: StringTarget[] = [
  { name: 'E (6)', target: 82.4 },
  { name: 'A (5)', target: 110 },
  { name: 'D (4)', target: 146.8 },
  { name: 'G (3)', target: 196 },
  { name: 'B (2)', target: 246.9 },
  { name: 'E (1)', target: 329.6 },
];

export const initialSessions: PracticeSession[] = [
  { id: 's1', label: 'Morning warm-up', minutes: 12, impact: 'Warmup' },
  { id: 's2', label: 'Strumming cleanup', minutes: 18, impact: 'Technique' },
  { id: 's3', label: 'Song repetition block', minutes: 24, impact: 'Songwork' },
];
