import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialPlans, initialSessions, initialSongs } from '../data/mockData';
import type { PracticePlan, PracticeSession, Song } from '../types/app';

const STORAGE_KEY = 'musician-growth-hub:v1';

const createFallbackSessionDate = (index: number) => {
  const date = new Date();
  date.setHours(18, 0, 0, 0);
  date.setDate(date.getDate() - index);
  return date.toISOString();
};

export type PersistedAppState = {
  plans: PracticePlan[];
  songs: Song[];
  sessions: PracticeSession[];
};

export const defaultPersistedState: PersistedAppState = {
  plans: initialPlans,
  songs: initialSongs,
  sessions: initialSessions,
};

export async function loadAppState(): Promise<PersistedAppState> {
  const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return defaultPersistedState;
  }

  const parsed = JSON.parse(rawValue) as Partial<PersistedAppState>;
  const normalizedSessions = Array.isArray(parsed.sessions)
    ? parsed.sessions.map((session, index) => ({
        ...session,
        loggedAt:
          typeof session.loggedAt === 'string'
            ? session.loggedAt
            : createFallbackSessionDate(index),
      }))
    : initialSessions;

  return {
    plans: Array.isArray(parsed.plans) ? parsed.plans : initialPlans,
    songs: Array.isArray(parsed.songs) ? parsed.songs : initialSongs,
    sessions: normalizedSessions,
  };
}

export async function saveAppState(state: PersistedAppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
