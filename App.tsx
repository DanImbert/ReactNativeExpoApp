import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

type FocusArea = 'Roadmap' | 'Tuner' | 'Practice' | 'Analytics';
type PracticePlan = { id: string; title: string; duration: number; focus: string; completed: boolean };
type Song = { id: string; title: string; level: string; progress: number };

const songs: Song[] = [
  { id: '1', title: 'Nothing Else Matters', level: 'Intermediate', progress: 60 },
  { id: '2', title: 'Wonderwall', level: 'Beginner', progress: 90 },
  { id: '3', title: 'Hotel California', level: 'Advanced', progress: 35 },
];

const strings = [
  { name: 'E (6)', target: 82.4 },
  { name: 'A (5)', target: 110 },
  { name: 'D (4)', target: 146.8 },
  { name: 'G (3)', target: 196 },
  { name: 'B (2)', target: 246.9 },
  { name: 'E (1)', target: 329.6 },
];

export default function App() {
  const [view, setView] = useState<FocusArea>('Roadmap');
  const [plans, setPlans] = useState<PracticePlan[]>([
    { id: 'p1', title: 'Fingerstyle warm-up', duration: 12, focus: 'Technique', completed: false },
    { id: 'p2', title: 'Scale run (C major)', duration: 15, focus: 'Speed', completed: true },
  ]);
  const [newPlan, setNewPlan] = useState('Build strumming consistency');
  const [selectedString, setSelectedString] = useState(strings[2]);
  const [detectedFreq, setDetectedFreq] = useState(146.8);

  const completedPlans = useMemo(() => plans.filter((item) => item.completed).length, [plans]);

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
      },
      ...prev,
    ]);
    setNewPlan('');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Musician Growth Hub</Text>
      <Text style={styles.subtitle}>Build your skills like a product team ships features.</Text>
      <View style={styles.tabRow}>
        {(['Roadmap', 'Tuner', 'Practice', 'Analytics'] as FocusArea[]).map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, view === item && styles.activeTab]}
            onPress={() => setView(item)}
          >
            <Text style={[styles.tabText, view === item && styles.activeTabText]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRoadmap = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Weekly Roadmap</Text>
      <Text style={styles.cardSubtitle}>A job here means shipping features, improving data, and coaching learners.</Text>
      <View style={styles.metricRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{completedPlans}/ {plans.length}</Text>
          <Text style={styles.metricLabel}>Practice tasks done</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>4</Text>
          <Text style={styles.metricLabel}>Mentorship sessions</Text>
        </View>
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
        <TouchableOpacity key={plan.id} style={styles.planRow} onPress={() => togglePlan(plan.id)}>
          <View style={styles.planLeft}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planHint}>{plan.duration} min • {plan.focus}</Text>
          </View>
          <Text style={[styles.planStatus, plan.completed && styles.planStatusDone]}>
            {plan.completed ? 'Done' : 'Open'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTuner = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Realtime Tuner</Text>
      <Text style={styles.cardSubtitle}>Simulated tuning with root note detection and quick actions.</Text>
      <View style={styles.tunerPanel}>
        <Text style={styles.noteLabel}>Selected String</Text>
        <Text style={styles.noteValue}>{selectedString.name}</Text>
        <View style={styles.stringRow}>
          {strings.map((string) => (
            <TouchableOpacity
              key={string.name}
              style={[styles.stringButton, selectedString.name === string.name && styles.stringButtonActive]}
              onPress={() => {
                setSelectedString(string);
                setDetectedFreq(string.target);
              }}
            >
              <Text style={styles.stringText}>{string.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tunerStatus}>
          <Text style={styles.statusLabel}>Target</Text>
          <Text style={styles.statusValue}>{selectedString.target.toFixed(1)} Hz</Text>
          <Text style={styles.statusLabel}>Detected</Text>
          <Text style={styles.statusValue}>{detectedFreq.toFixed(1)} Hz</Text>
          <Text style={styles.statusHint}>Status: {Math.abs(detectedFreq - selectedString.target) < 1 ? 'In tune 🎯' : 'Adjust string tension'}</Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button title="Calibrate" onPress={() => setDetectedFreq(selectedString.target + (Math.random() * 2 - 1))} />
        <Button title="Practice Mode" onPress={() => setView('Practice')} />
      </View>
    </View>
  );

  const renderPractice = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Practice Dashboard</Text>
      <Text style={styles.cardSubtitle}>Track sessions, songs, and consistency for long-term growth.</Text>
      {songs.map((song) => (
        <View key={song.id} style={styles.songCard}>
          <View>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songMeta}>{song.level}</Text>
          </View>
          <Text style={styles.songProgress}>{song.progress}%</Text>
        </View>
      ))}
      <View style={styles.proTip}>
        <Text style={styles.tipTitle}>Pro tip</Text>
        <Text style={styles.tipText}>Split each session into goal {'->'} attempt {'->'} reflection. Ship small improvements every day.</Text>
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Product Analytics</Text>
      <Text style={styles.cardSubtitle}>As an engineer, you read metrics and improve user outcomes.</Text>
      <View style={styles.analyticsRow}>
        <View style={styles.analyticsBox}>
          <Text style={styles.analyticsValue}>72%</Text>
          <Text style={styles.analyticsLabel}>Retention</Text>
        </View>
        <View style={styles.analyticsBox}>
          <Text style={styles.analyticsValue}>1.8x</Text>
          <Text style={styles.analyticsLabel}>Lesson Completion</Text>
        </View>
      </View>
      <View style={styles.analyticsRow}>
        <View style={styles.analyticsBox}>
          <Text style={styles.analyticsValue}>+25</Text>
          <Text style={styles.analyticsLabel}>Weekly Active Learners</Text>
        </View>
        <View style={styles.analyticsBox}>
          <Text style={styles.analyticsValue}>4.9 ⭐</Text>
          <Text style={styles.analyticsLabel}>User Satisfaction</Text>
        </View>
      </View>
    </View>
  );

  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView>
        {renderHeader()}
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
  tabRow: { flexDirection: 'row', marginTop: 14, flexWrap: 'wrap' },
  tab: { marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff' },
  activeTab: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  tabText: { color: '#334155', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  card: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { marginTop: 4, color: '#475569', marginBottom: 10 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metricBox: { flex: 1, marginRight: 8, backgroundColor: '#eef2ff', borderRadius: 10, padding: 10 },
  metricValue: { fontWeight: '700', fontSize: 18, color: '#1d4ed8' },
  metricLabel: { color: '#475569', fontSize: 12, marginTop: 2 },
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
  tunerStatus: { marginTop: 12, padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  statusLabel: { fontSize: 12, color: '#475569' },
  statusValue: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#111827' },
  statusHint: { color: '#0f172a', fontWeight: '600' },
  buttonRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  songCard: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 10, marginBottom: 8, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  songTitle: { fontWeight: '700' },
  songMeta: { fontSize: 12, color: '#64748b' },
  songProgress: { fontWeight: '700', color: '#0f172a' },
  proTip: { marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: '#dbeafe', backgroundColor: '#eef2ff', padding: 10 },
  tipTitle: { fontWeight: '700', color: '#1d4ed8' },
  tipText: { color: '#1f2937', marginTop: 4 },
  analyticsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  analyticsBox: { flex: 1, backgroundColor: '#eef2ff', borderRadius: 10, borderWidth: 1, borderColor: '#c7d2fe', marginRight: 8, padding: 10 },
  analyticsValue: { fontSize: 20, fontWeight: '700', color: '#1d4ed8' },
  analyticsLabel: { fontSize: 12, color: '#475569', marginTop: 3 },
});
