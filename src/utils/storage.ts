import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialPlans, initialSessions, initialSongs } from '../data/mockData';
import type { PracticePlan, PracticeSession, Song } from '../types/app';

const STORAGE_KEY = 'musician-growth-hub:v1';

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

  return {
    plans: Array.isArray(parsed.plans) ? parsed.plans : initialPlans,
    songs: Array.isArray(parsed.songs) ? parsed.songs : initialSongs,
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : initialSessions,
  };
}

export async function saveAppState(state: PersistedAppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
