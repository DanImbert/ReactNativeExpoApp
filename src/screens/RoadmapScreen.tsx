import React from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';

import { MetricCard } from '../components/MetricCard';
import { appStyles } from '../styles/appStyles';
import type { PracticePlan } from '../types/app';

type RoadmapScreenProps = {
  coachMessage: string;
  completedPlans: number;
  completionRate: number;
  newPlan: string;
  onAddPlan: () => void;
  onChangeNewPlan: (value: string) => void;
  onTogglePlan: (id: string) => void;
  plans: PracticePlan[];
};

export function RoadmapScreen({
  coachMessage,
  completedPlans,
  completionRate,
  newPlan,
  onAddPlan,
  onChangeNewPlan,
  onTogglePlan,
  plans,
}: RoadmapScreenProps) {
  return (
    <View style={appStyles.card} testID="roadmap-screen">
      <Text style={appStyles.sectionTitle}>Weekly Roadmap</Text>
      <Text style={appStyles.cardSubtitle}>
        Plan the week, track completion, and keep practice focused.
      </Text>
      <View style={appStyles.metricRow}>
        <MetricCard value={`${completedPlans}/${plans.length}`} label="Practice tasks done" />
        <MetricCard value={`${completionRate}%`} label="Roadmap completion" />
      </View>
      <View style={appStyles.addRow}>
        <TextInput
          accessibilityHint="Enter a short description for a new roadmap item"
          accessibilityLabel="New practice goal"
          onChangeText={onChangeNewPlan}
          onSubmitEditing={onAddPlan}
          placeholder="Add a new practice goal"
          returnKeyType="done"
          style={appStyles.input}
          testID="new-plan-input"
          value={newPlan}
        />
        <View style={appStyles.addButton}>
          <Button onPress={onAddPlan} testID="add-plan-button" title="Add" />
        </View>
      </View>
      {plans.map((plan) => (
        <Pressable
          accessibilityHint="Toggles the completion state of this roadmap item"
          accessibilityLabel={`${plan.title}, ${plan.completed ? 'done' : 'open'}`}
          accessibilityRole="button"
          key={plan.id}
          onPress={() => onTogglePlan(plan.id)}
          style={appStyles.planRow}
        >
          <View style={appStyles.planLeft}>
            <Text style={appStyles.planTitle}>{plan.title}</Text>
            <Text style={appStyles.planHint}>
              {plan.duration} min • {plan.focus} • {plan.intensity}
            </Text>
          </View>
          <Text style={[appStyles.planStatus, plan.completed && appStyles.planStatusDone]}>
            {plan.completed ? 'Done' : 'Open'}
          </Text>
        </Pressable>
      ))}
      <View style={appStyles.coachCard}>
        <Text style={appStyles.coachLabel}>Coach note</Text>
        <Text style={appStyles.coachText}>{coachMessage}</Text>
      </View>
    </View>
  );
}
