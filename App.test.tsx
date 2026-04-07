import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import App from './App';
import { initialPlans, initialSessions, initialSongs } from './src/data/mockData';
import { loadAppState, saveAppState } from './src/utils/storage';

jest.mock('./src/utils/storage', () => ({
  __esModule: true,
  loadAppState: jest.fn(),
  saveAppState: jest.fn(),
}));

const mockedLoadAppState = jest.mocked(loadAppState);
const mockedSaveAppState = jest.mocked(saveAppState);

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLoadAppState.mockResolvedValue({
      plans: initialPlans,
      songs: initialSongs,
      sessions: initialSessions,
    });
    mockedSaveAppState.mockResolvedValue(undefined);
  });

  it('adds and completes a roadmap item', async () => {
    render(<App />);

    await waitFor(() => expect(mockedLoadAppState).toHaveBeenCalled());

    fireEvent.changeText(screen.getByLabelText('New practice goal'), 'Lock in barre chords');
    fireEvent.press(screen.getByText('Add'));

    expect(screen.getByText('Lock in barre chords')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Lock in barre chords, open'));

    expect(screen.getByLabelText('Lock in barre chords, done')).toBeTruthy();
  });

  it('logs a new practice session from the practice screen', async () => {
    render(<App />);

    await waitFor(() => expect(mockedLoadAppState).toHaveBeenCalled());

    fireEvent.press(screen.getByLabelText('Practice tab'));

    expect(screen.getByText('Practice Dashboard')).toBeTruthy();

    fireEvent.press(screen.getByTestId('log-session-button'));

    expect(screen.getByText('Focused block 4')).toBeTruthy();
    expect(screen.getByTestId('weekly-session-summary').props.children.join('')).toContain(
      '4 logged in the last 7 days',
    );
  });

  it('advances song progress from the practice screen', async () => {
    render(<App />);

    await waitFor(() => expect(mockedLoadAppState).toHaveBeenCalled());

    fireEvent.press(screen.getByLabelText('Practice tab'));
    fireEvent.press(screen.getByTestId('advance-song-1'));

    expect(screen.getByTestId('song-progress-1').props.children.join('')).toBe('68%');
  });
});
