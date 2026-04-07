import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  Text,
  View,
} from 'react-native';

import { AppHeader } from './src/components/AppHeader';
import { initialPlans, initialSessions, initialSongs, strings } from './src/data/mockData';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { PracticeScreen } from './src/screens/PracticeScreen';
import { RoadmapScreen } from './src/screens/RoadmapScreen';
import { TunerScreen } from './src/screens/TunerScreen';
import { appStyles } from './src/styles/appStyles';
import type {
  FocusArea,
  PracticePlan,
  PracticeSession,
  Song,
  StringTarget,
} from './src/types/app';
import {
  getAverageAccuracy,
  getAverageSongProgress,
  getCoachMessage,
  getCompletedPlans,
  getCompletionRate,
  getTuningOffset,
  getWeeklyMinutes,
  getWeeklySessionCount,
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
  const weeklySessionCount = useMemo(() => getWeeklySessionCount(sessions), [sessions]);
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
    setPlans((prev) => prev.map((plan) => (plan.id === id ? { ...plan, completed: !plan.completed } : plan)));
  };

  const addPlan = () => {
    if (!newPlan.trim()) {
      return;
    }

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
        loggedAt: new Date().toISOString(),
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

  const selectString = (next: StringTarget) => {
    setSelectedString(next);
    setDetectedFreq(next.target);
  };

  return (
    <View style={appStyles.container}>
      <SafeAreaView
        style={[
          appStyles.safeArea,
          { paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0 },
        ]}
      >
        <ScrollView contentContainerStyle={appStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <AppHeader onChange={setView} view={view} />
          {!isHydrated && (
            <View style={appStyles.syncBanner}>
              <Text style={appStyles.syncBannerText}>Restoring your saved practice data...</Text>
            </View>
          )}
          {view === 'Roadmap' && (
            <RoadmapScreen
              coachMessage={coachMessage}
              completedPlans={completedPlans}
              completionRate={completionRate}
              newPlan={newPlan}
              onAddPlan={addPlan}
              onChangeNewPlan={setNewPlan}
              onTogglePlan={togglePlan}
              plans={plans}
            />
          )}
          {view === 'Tuner' && (
            <TunerScreen
              detectedFreq={detectedFreq}
              onCalibrate={() =>
                setDetectedFreq(selectedString.target + (Math.random() * 2.4 - 1.2))
              }
              onNudgeFlat={() => setDetectedFreq((prev) => prev - 0.6)}
              onNudgeSharp={() => setDetectedFreq((prev) => prev + 0.6)}
              onPracticeMode={() => setView('Practice')}
              onSelectString={selectString}
              selectedString={selectedString}
              tuningOffset={tuningOffset}
            />
          )}
          {view === 'Practice' && (
            <PracticeScreen
              averageAccuracy={averageAccuracy}
              onAdvanceSong={advanceSong}
              onLogSession={logPracticeSession}
              sessions={sessions}
              songs={songs}
              weeklyMinutes={weeklyMinutes}
              weeklySessionCount={weeklySessionCount}
            />
          )}
          {view === 'Analytics' && (
            <AnalyticsScreen
              averageAccuracy={averageAccuracy}
              averageSongProgress={averageSongProgress}
              completionRate={completionRate}
              weeklyMinutes={weeklyMinutes}
            />
          )}
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
}
