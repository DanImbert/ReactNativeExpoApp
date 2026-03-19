import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  Pressable,
} from 'react-native';

import { MetricCard } from './src/components/MetricCard';
import { ProgressBar } from './src/components/ProgressBar';
import { TabBar } from './src/components/TabBar';
import { initialPlans, initialSessions, initialSongs, strings } from './src/data/mockData';
import type { FocusArea, PracticePlan, PracticeSession, Song } from './src/types/app';
import {
  getAverageAccuracy,
  getAverageSongProgress,
  getCoachMessage,
  getCompletedPlans,
  getCompletionRate,
  getTuningOffset,
  getTuningStatus,
  getWeeklyMinutes,
} from './src/utils/analytics';
import { loadAppState, saveAppState } from './src/utils/storage';

export default function App() {
  const [view, setView] = useState<FocusArea>('Roadmap');
  const [plans, setPlans] = useState<PracticePlan[]>(initialPlans);
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [sessions, setSessions] = useState<PracticeSession[]>(initialSessions);
  const [newPlan, setNewPlan] = useState('Build strumming consistency');
  const [selectedString, setSelectedString] = useState(strings[2]);
  const [detectedFreq, setDetectedFreq] = useState(146.8);
  const [isHydrated, setIsHydrated] = useState(false);

  const completedPlans = useMemo(() => getCompletedPlans(plans), [plans]);
  const completionRate = useMemo(() => getCompletionRate(plans), [plans]);
  const weeklyMinutes = useMemo(() => getWeeklyMinutes(sessions), [sessions]);
  const averageSongProgress = useMemo(() => getAverageSongProgress(songs), [songs]);
  const averageAccuracy = useMemo(() => getAverageAccuracy(songs), [songs]);
  const tuningOffset = useMemo(
    () => getTuningOffset(detectedFreq, selectedString),
    [detectedFreq, selectedString],
  );
  const coachMessage = useMemo(
    () => getCoachMessage(plans, songs, sessions),
    [plans, songs, sessions],
  );

  useEffect(() => {
    let isMounted = true;

    const hydrateApp = async () => {
      try {
        const persistedState = await loadAppState();

        if (!isMounted) {
          return;
        }

        setPlans(persistedState.plans);
        setSongs(persistedState.songs);
        setSessions(persistedState.sessions);
      } catch (error) {
        console.warn('Failed to hydrate app state', error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    hydrateApp();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveAppState({ plans, songs, sessions }).catch((error) => {
      console.warn('Failed to persist app state', error);
    });
  }, [isHydrated, plans, songs, sessions]);

  const togglePlan = (id: string) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)));
  };

  const addPlan = () => {
    if (!newPlan.trim()) return;
    setPlans((prev) => [
      {
        id: `${Date.now()}`,
        title: newPlan.trim(),
        duration: 10,
        focus: 'Consistency',
        completed: false,
        intensity: 'Core',
      },
      ...prev,
    ]);
    setNewPlan('');
  };

  const logPracticeSession = () => {
    const nextId = `${Date.now()}`;

    setSessions((prev) => [
      {
        id: nextId,
        label: `Focused block ${prev.length + 1}`,
        minutes: 15,
        impact: prev.length % 2 === 0 ? 'Technique' : 'Songwork',
      },
      ...prev,
    ]);
  };

  const advanceSong = (id: string) => {
    setSongs((prev) =>
      prev.map((song) =>
        song.id === id
          ? {
              ...song,
              progress: Math.min(song.progress + 8, 100),
              accuracy: Math.min(song.accuracy + 2, 100),
            }
          : song,
      ),
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Musician Growth Hub</Text>
      <Text style={styles.subtitle}>
        A compact practice app concept focused on feedback, routine, and progress.
      </Text>
      <TabBar value={view} onChange={setView} />
    </View>
  );

  const renderRoadmap = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Weekly Roadmap</Text>
      <Text style={styles.cardSubtitle}>Plan the week, track completion, and keep practice focused.</Text>
      <View style={styles.metricRow}>
        <MetricCard value={`${completedPlans}/${plans.length}`} label="Practice tasks done" />
        <MetricCard value={`${completionRate}%`} label="Roadmap completion" />
      </View>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new practice goal"
          value={newPlan}
          onChangeText={setNewPlan}
          returnKeyType="done"
          onSubmitEditing={addPlan}
        />
        <Button title="Add" onPress={addPlan} />
      </View>
      {plans.map((plan) => (
        <Pressable key={plan.id} style={styles.planRow} onPress={() => togglePlan(plan.id)}>
          <View style={styles.planLeft}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planHint}>
              {plan.duration} min • {plan.focus} • {plan.intensity}
            </Text>
          </View>
          <Text style={[styles.planStatus, plan.completed && styles.planStatusDone]}>
            {plan.completed ? 'Done' : 'Open'}
          </Text>
        </Pressable>
      ))}
      <View style={styles.coachCard}>
        <Text style={styles.coachLabel}>Coach note</Text>
        <Text style={styles.coachText}>{coachMessage}</Text>
      </View>
    </View>
  );

  const renderTuner = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Realtime Tuner</Text>
      <Text style={styles.cardSubtitle}>A simulated tuner with directional feedback and quick adjustments.</Text>
      <View style={styles.tunerPanel}>
        <Text style={styles.noteLabel}>Selected String</Text>
        <Text style={styles.noteValue}>{selectedString.name}</Text>
        <View style={styles.stringRow}>
          {strings.map((string) => (
            <Pressable
              key={string.name}
              style={[styles.stringButton, selectedString.name === string.name && styles.stringButtonActive]}
              onPress={() => {
                setSelectedString(string);
                setDetectedFreq(string.target);
              }}
            >
              <Text
                style={[
                  styles.stringText,
                  selectedString.name === string.name && styles.stringTextActive,
                ]}
              >
                {string.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.tunerStatus}>
          <Text style={styles.statusLabel}>Target</Text>
          <Text style={styles.statusValue}>{selectedString.target.toFixed(1)} Hz</Text>
          <Text style={styles.statusLabel}>Detected</Text>
          <Text style={styles.statusValue}>{detectedFreq.toFixed(1)} Hz</Text>
          <Text style={styles.statusHint}>
            Status: {getTuningStatus(tuningOffset)} ({tuningOffset > 0 ? '+' : ''}
            {tuningOffset} Hz)
          </Text>
          <ProgressBar progress={Math.max(0, 100 - Math.min(Math.abs(tuningOffset) * 18, 100))} />
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Calibrate"
          onPress={() => setDetectedFreq(selectedString.target + (Math.random() * 2.4 - 1.2))}
        />
        <Button title="Nudge Flat" onPress={() => setDetectedFreq((prev) => prev - 0.6)} />
        <Button title="Nudge Sharp" onPress={() => setDetectedFreq((prev) => prev + 0.6)} />
      </View>
      <View style={styles.secondaryButtonRow}>
        <Button title="Practice Mode" onPress={() => setView('Practice')} />
      </View>
    </View>
  );

  const renderPractice = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Practice Dashboard</Text>
      <Text style={styles.cardSubtitle}>Track songs, recent sessions, and overall practice quality.</Text>
      <View style={styles.metricRow}>
        <MetricCard value={`${weeklyMinutes} min`} label="Weekly practice" />
        <MetricCard value={`${averageAccuracy}%`} label="Average accuracy" />
      </View>
      <View style={styles.sessionCard}>
        <View>
          <Text style={styles.sessionTitle}>Recent sessions</Text>
          <Text style={styles.sessionHint}>
            {sessions.length} logged this week with a focus on consistency over intensity.
          </Text>
        </View>
        <Button title="Log Session" onPress={logPracticeSession} />
      </View>
      {sessions.slice(0, 3).map((session) => (
        <View key={session.id} style={styles.sessionRow}>
          <Text style={styles.sessionRowTitle}>{session.label}</Text>
          <Text style={styles.sessionRowMeta}>
            {session.minutes} min • {session.impact}
          </Text>
        </View>
      ))}
      {songs.map((song) => (
        <View key={song.id} style={styles.songCard}>
          <View style={styles.songDetails}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songMeta}>
              {song.level} • {song.accuracy}% accuracy
            </Text>
            <ProgressBar progress={song.progress} />
          </View>
          <View style={styles.songAction}>
            <Text style={styles.songProgress}>{song.progress}%</Text>
            <Button title="Advance" onPress={() => advanceSong(song.id)} />
          </View>
        </View>
      ))}
      <View style={styles.proTip}>
        <Text style={styles.tipTitle}>Practice tip</Text>
        <Text style={styles.tipText}>
          Split each session into goal {'->'} attempt {'->'} reflection. That gives you cleaner feedback and clearer next steps.
        </Text>
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Product Analytics</Text>
      <Text style={styles.cardSubtitle}>A simple summary of learner progress and practice consistency.</Text>
      <View style={styles.analyticsRow}>
        <MetricCard value={`${averageSongProgress}%`} label="Song progress avg" />
        <MetricCard value={`${weeklyMinutes} min`} label="Weekly learning time" />
      </View>
      <View style={styles.analyticsRow}>
        <MetricCard value={`${completionRate}%`} label="Plan completion" />
        <MetricCard value={`${averageAccuracy}%`} label="Average song accuracy" />
      </View>
      <View style={styles.analyticsSummary}>
        <Text style={styles.analyticsSummaryTitle}>Next step</Text>
        <Text style={styles.analyticsSummaryText}>
          The next improvement would be microphone-driven tuning to make the feedback loop real.
        </Text>
      </View>
    </View>
  );

  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView>
        {renderHeader()}
        {!isHydrated && (
          <View style={styles.syncBanner}>
            <Text style={styles.syncBannerText}>Restoring your saved practice data...</Text>
          </View>
        )}
        {view === 'Roadmap' && renderRoadmap()}
        {view === 'Tuner' && renderTuner()}
        {view === 'Practice' && renderPractice()}
        {view === 'Analytics' && renderAnalytics()}
      </ScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7ff', paddingTop: 50 },
  darkContainer: { backgroundColor: '#111830' },
  header: { paddingHorizontal: 16, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { marginTop: 6, fontSize: 14, color: '#334155' },
  card: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { marginTop: 4, color: '#475569', marginBottom: 10 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  addRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', padding: 10, borderRadius: 9, marginRight: 8, backgroundColor: '#fff' },
  planRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between', padding: 10, borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 10 },
  planLeft: { flex: 1 },
  planTitle: { fontWeight: '600', color: '#0f172a' },
  planHint: { color: '#64748b', fontSize: 12, marginTop: 2 },
  planStatus: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  planStatusDone: { color: '#15803d' },
  tunerPanel: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#f8fafc' },
  noteLabel: { color: '#475569', fontSize: 13 },
  noteValue: { fontSize: 30, fontWeight: '800', marginTop: 4, color: '#1d4ed8' },
  stringRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  stringButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, marginRight: 6, marginBottom: 6, backgroundColor: '#fff' },
  stringButtonActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  stringText: { color: '#0f172a', fontWeight: '600' },
  stringTextActive: { color: '#fff' },
  tunerStatus: { marginTop: 12, padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  statusLabel: { fontSize: 12, color: '#475569' },
  statusValue: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#111827' },
  statusHint: { color: '#0f172a', fontWeight: '600' },
  buttonRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  secondaryButtonRow: { marginTop: 8, alignSelf: 'flex-start' },
  coachCard: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
    padding: 12,
  },
  coachLabel: { fontWeight: '700', color: '#1d4ed8', marginBottom: 4 },
  coachText: { color: '#1e293b', lineHeight: 20 },
  sessionCard: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 10,
    backgroundColor: '#f8fbff',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitle: { fontWeight: '700', color: '#0f172a' },
  sessionHint: { marginTop: 2, color: '#64748b', maxWidth: 200 },
  sessionRow: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  sessionRowTitle: { fontWeight: '600', color: '#0f172a' },
  sessionRowMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  songCard: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 10, marginBottom: 8, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  songDetails: { flex: 1, paddingRight: 10 },
  songAction: { alignItems: 'flex-end', minWidth: 88 },
  songTitle: { fontWeight: '700' },
  songMeta: { fontSize: 12, color: '#64748b' },
  songProgress: { fontWeight: '700', color: '#0f172a' },
  proTip: { marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: '#dbeafe', backgroundColor: '#eef2ff', padding: 10 },
  tipTitle: { fontWeight: '700', color: '#1d4ed8' },
  tipText: { color: '#1f2937', marginTop: 4 },
  analyticsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  analyticsSummary: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 10,
  },
  analyticsSummaryTitle: { fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  analyticsSummaryText: { color: '#475569', lineHeight: 20 },
  syncBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
  },
  syncBannerText: { color: '#1d4ed8', fontWeight: '600' },
});
