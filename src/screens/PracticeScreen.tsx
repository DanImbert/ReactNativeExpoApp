import React from 'react';
import { Button, Text, View } from 'react-native';

import { MetricCard } from '../components/MetricCard';
import { ProgressBar } from '../components/ProgressBar';
import { appStyles } from '../styles/appStyles';
import type { PracticeSession, Song } from '../types/app';

type PracticeScreenProps = {
  averageAccuracy: number;
  onAdvanceSong: (id: string) => void;
  onLogSession: () => void;
  sessions: PracticeSession[];
  songs: Song[];
  weeklyMinutes: number;
  weeklySessionCount: number;
};

export function PracticeScreen({
  averageAccuracy,
  onAdvanceSong,
  onLogSession,
  sessions,
  songs,
  weeklyMinutes,
  weeklySessionCount,
}: PracticeScreenProps) {
  return (
    <View style={appStyles.card} testID="practice-screen">
      <Text style={appStyles.sectionTitle}>Practice Dashboard</Text>
      <Text style={appStyles.cardSubtitle}>
        Track songs, recent sessions, and overall practice quality.
      </Text>
      <View style={appStyles.metricRow}>
        <MetricCard value={`${weeklyMinutes} min`} label="Last 7 days" />
        <MetricCard value={`${averageAccuracy}%`} label="Average accuracy" />
      </View>
      <View style={appStyles.sessionCard}>
        <View style={appStyles.sessionSummary}>
          <Text style={appStyles.sessionTitle}>Recent sessions</Text>
          <Text style={appStyles.sessionHint} testID="weekly-session-summary">
            {weeklySessionCount} logged in the last 7 days with a focus on consistency over
            intensity.
          </Text>
        </View>
        <View style={appStyles.sessionAction}>
          <Button onPress={onLogSession} testID="log-session-button" title="Log Session" />
        </View>
      </View>
      {sessions.slice(0, 3).map((session) => (
        <View key={session.id} style={appStyles.sessionRow}>
          <Text style={appStyles.sessionRowTitle}>{session.label}</Text>
          <Text style={appStyles.sessionRowMeta}>
            {session.minutes} min • {session.impact}
          </Text>
        </View>
      ))}
      {songs.map((song) => (
        <View
          accessibilityLabel={`${song.title}, ${song.level}, ${song.progress} percent progress, ${song.accuracy} percent accuracy`}
          key={song.id}
          style={appStyles.songCard}
          testID={`song-card-${song.id}`}
        >
          <View style={appStyles.songDetails}>
            <Text style={appStyles.songTitle}>{song.title}</Text>
            <Text style={appStyles.songMeta}>
              {song.level} • {song.accuracy}% accuracy
            </Text>
            <ProgressBar progress={song.progress} />
          </View>
          <View style={appStyles.songAction}>
            <Text style={appStyles.songProgress} testID={`song-progress-${song.id}`}>
              {song.progress}%
            </Text>
            <Button
              onPress={() => onAdvanceSong(song.id)}
              testID={`advance-song-${song.id}`}
              title="Advance"
            />
          </View>
        </View>
      ))}
      <View style={appStyles.proTip}>
        <Text style={appStyles.tipTitle}>Practice tip</Text>
        <Text style={appStyles.tipText}>
          Split each session into goal {'->'} attempt {'->'} reflection. That gives you cleaner
          feedback and clearer next steps.
        </Text>
      </View>
    </View>
  );
}
