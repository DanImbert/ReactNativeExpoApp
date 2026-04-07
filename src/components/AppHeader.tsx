import React from 'react';
import { Text, View } from 'react-native';

import { appStyles } from '../styles/appStyles';
import type { FocusArea } from '../types/app';
import { TabBar } from './TabBar';

type AppHeaderProps = {
  onChange: (next: FocusArea) => void;
  view: FocusArea;
};

export function AppHeader({ onChange, view }: AppHeaderProps) {
  return (
    <View style={appStyles.header}>
      <Text style={appStyles.title}>Musician Growth Hub</Text>
      <Text style={appStyles.subtitle}>
        A compact practice app concept focused on feedback, routine, and progress.
      </Text>
      <View style={appStyles.reviewCard}>
        <Text style={appStyles.reviewTitle}>Practice system</Text>
        <Text style={appStyles.reviewText}>
          Set focused goals, tune quickly, and track progress through short, repeatable
          practice loops.
        </Text>
      </View>
      <TabBar onChange={onChange} value={view} />
    </View>
  );
}
