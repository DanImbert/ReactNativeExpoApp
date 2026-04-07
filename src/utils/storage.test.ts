import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialPlans, initialSessions, initialSongs } from '../data/mockData';
import { loadAppState, saveAppState } from './storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('returns the default state when nothing has been persisted', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(loadAppState()).resolves.toEqual({
      plans: initialPlans,
      songs: initialSongs,
      sessions: initialSessions,
    });
  });

  it('migrates legacy sessions without loggedAt and preserves existing timestamps', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-07T12:00:00.000Z'));

    mockAsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        plans: [],
        songs: [],
        sessions: [
          {
            id: 'legacy-session',
            label: 'Legacy session',
            minutes: 10,
            impact: 'Warmup',
          },
          {
            id: 'dated-session',
            label: 'Dated session',
            minutes: 15,
            impact: 'Technique',
            loggedAt: '2026-04-03T10:00:00.000Z',
          },
        ],
      }),
    );

    const state = await loadAppState();

    expect(state.plans).toEqual([]);
    expect(state.songs).toEqual([]);
    expect(state.sessions).toHaveLength(2);
    expect(typeof state.sessions[0].loggedAt).toBe('string');
    expect(Number.isNaN(Date.parse(state.sessions[0].loggedAt))).toBe(false);
    expect(state.sessions[1].loggedAt).toBe('2026-04-03T10:00:00.000Z');
  });

  it('persists the current state under the app storage key', async () => {
    const state = {
      plans: initialPlans,
      songs: initialSongs,
      sessions: initialSessions,
    };

    await saveAppState(state);

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'musician-growth-hub:v1',
      JSON.stringify(state),
    );
  });
});
