import React from 'react';
import { Text, View } from 'react-native';

import { MetricCard } from '../components/MetricCard';
import { appStyles } from '../styles/appStyles';

type AnalyticsScreenProps = {
  averageAccuracy: number;
  averageSongProgress: number;
  completionRate: number;
  weeklyMinutes: number;
};

export function AnalyticsScreen({
  averageAccuracy,
  averageSongProgress,
  completionRate,
  weeklyMinutes,
}: AnalyticsScreenProps) {
  return (
    <View style={appStyles.card} testID="analytics-screen">
      <Text style={appStyles.sectionTitle}>Product Analytics</Text>
      <Text style={appStyles.cardSubtitle}>
        A simple summary of learner progress and recent practice consistency.
      </Text>
      <View style={appStyles.analyticsRow}>
        <MetricCard value={`${averageSongProgress}%`} label="Song progress avg" />
        <MetricCard value={`${weeklyMinutes} min`} label="Minutes last 7d" />
      </View>
      <View style={appStyles.analyticsRow}>
        <MetricCard value={`${completionRate}%`} label="Plan completion" />
        <MetricCard value={`${averageAccuracy}%`} label="Average song accuracy" />
      </View>
      <View style={appStyles.analyticsSummary}>
        <Text style={appStyles.analyticsSummaryTitle}>Next step</Text>
        <Text style={appStyles.analyticsSummaryText}>
          The next improvement would be microphone-driven tuning to make the feedback loop real.
        </Text>
      </View>
    </View>
  );
}
