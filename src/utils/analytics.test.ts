import {
  getCoachMessage,
  getWeeklyMinutes,
  getWeeklySessionCount,
} from './analytics';
import type { PracticePlan, PracticeSession, Song } from '../types/app';

const now = new Date('2026-04-07T12:00:00.000Z');
const createRelativeIso = (daysFromNow: number, hour: number) => {
  const date = new Date(now);
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

describe('analytics', () => {
  it('counts only sessions from the last 7 days', () => {
    const sessions: PracticeSession[] = [
      {
        id: 'recent-1',
        label: 'Today',
        minutes: 15,
        impact: 'Technique',
        loggedAt: createRelativeIso(0, 9),
      },
      {
        id: 'recent-2',
        label: 'Boundary',
        minutes: 20,
        impact: 'Songwork',
        loggedAt: createRelativeIso(-6, 0),
      },
      {
        id: 'old',
        label: 'Too old',
        minutes: 45,
        impact: 'Warmup',
        loggedAt: createRelativeIso(-7, 23),
      },
      {
        id: 'future',
        label: 'Future',
        minutes: 30,
        impact: 'Technique',
        loggedAt: createRelativeIso(1, 9),
      },
      {
        id: 'invalid',
        label: 'Invalid',
        minutes: 10,
        impact: 'Warmup',
        loggedAt: 'not-a-date',
      },
    ];

    expect(getWeeklyMinutes(sessions, now)).toBe(35);
    expect(getWeeklySessionCount(sessions, now)).toBe(2);
  });

  it('uses the recent-session window in the coach message', () => {
    const plans: PracticePlan[] = [
      {
        id: 'p1',
        title: 'Plan 1',
        duration: 10,
        focus: 'Consistency',
        completed: true,
        intensity: 'Core',
      },
      {
        id: 'p2',
        title: 'Plan 2',
        duration: 15,
        focus: 'Technique',
        completed: false,
        intensity: 'Stretch',
      },
    ];
    const songs: Song[] = [
      { id: 's1', title: 'Song 1', level: 'Beginner', progress: 70, accuracy: 88 },
      { id: 's2', title: 'Song 2', level: 'Intermediate', progress: 65, accuracy: 92 },
    ];
    const sessions: PracticeSession[] = [
      {
        id: 'recent',
        label: 'Recent block',
        minutes: 20,
        impact: 'Technique',
        loggedAt: '2026-04-06T10:00:00.000Z',
      },
      {
        id: 'old',
        label: 'Old marathon',
        minutes: 90,
        impact: 'Songwork',
        loggedAt: '2026-03-20T10:00:00.000Z',
      },
    ];

    jest.useFakeTimers().setSystemTime(now);

    expect(getCoachMessage(plans, songs, sessions)).toBe(
      'Your accuracy is solid. Add one more short session over the next few days to keep momentum compounding.',
    );

    jest.useRealTimers();
  });
});
