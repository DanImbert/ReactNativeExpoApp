import type { PracticePlan, PracticeSession, Song, StringTarget } from '../types/app';

const getRecentWindowStart = (now: Date) => {
  const windowStart = new Date(now);
  windowStart.setHours(0, 0, 0, 0);
  windowStart.setDate(windowStart.getDate() - 6);
  return windowStart;
};

const isRecentSession = (session: PracticeSession, now: Date) => {
  const loggedAt = new Date(session.loggedAt);

  if (Number.isNaN(loggedAt.getTime())) {
    return false;
  }

  return loggedAt >= getRecentWindowStart(now) && loggedAt <= now;
};

export const getCompletedPlans = (plans: PracticePlan[]) =>
  plans.filter((plan) => plan.completed).length;

export const getCompletionRate = (plans: PracticePlan[]) => {
  if (plans.length === 0) {
    return 0;
  }

  return Math.round((getCompletedPlans(plans) / plans.length) * 100);
};

export const getWeeklyMinutes = (sessions: PracticeSession[], now = new Date()) =>
  sessions.reduce(
    (total, session) => (isRecentSession(session, now) ? total + session.minutes : total),
    0,
  );

export const getWeeklySessionCount = (sessions: PracticeSession[], now = new Date()) =>
  sessions.filter((session) => isRecentSession(session, now)).length;

export const getAverageSongProgress = (songs: Song[]) => {
  if (songs.length === 0) {
    return 0;
  }

  return Math.round(songs.reduce((total, song) => total + song.progress, 0) / songs.length);
};

export const getAverageAccuracy = (songs: Song[]) => {
  if (songs.length === 0) {
    return 0;
  }

  return Math.round(songs.reduce((total, song) => total + song.accuracy, 0) / songs.length);
};

export const getTuningOffset = (detectedFreq: number, selectedString: StringTarget) =>
  Number((detectedFreq - selectedString.target).toFixed(1));

export const getTuningStatus = (offset: number) => {
  if (Math.abs(offset) < 0.5) {
    return 'In tune';
  }

  return offset < 0 ? 'Tune up' : 'Tune down';
};

export const getCoachMessage = (
  plans: PracticePlan[],
  songs: Song[],
  sessions: PracticeSession[],
) => {
  const completionRate = getCompletionRate(plans);
  const weeklyMinutes = getWeeklyMinutes(sessions);
  const averageAccuracy = getAverageAccuracy(songs);

  if (completionRate < 50) {
    return 'Focus on finishing your roadmap before adding more songs. Consistency will lift the rest.';
  }

  if (averageAccuracy < 80) {
    return 'Your practice volume is healthy. Slow down tough passages and chase cleaner repetitions next.';
  }

  if (weeklyMinutes < 45) {
    return 'Your accuracy is solid. Add one more short session over the next few days to keep momentum compounding.';
  }

  return 'Great balance. You are building consistency, accuracy, and repertoire like a strong long-term learner.';
};
