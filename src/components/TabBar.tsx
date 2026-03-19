import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FocusArea } from '../types/app';

type TabBarProps = {
  value: FocusArea;
  onChange: (next: FocusArea) => void;
};

const tabs: FocusArea[] = ['Roadmap', 'Tuner', 'Practice', 'Analytics'];

export function TabBar({ value, onChange }: TabBarProps) {
  return (
    <View style={styles.tabRow}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          accessibilityRole="button"
          accessibilityState={{ selected: value === tab }}
          onPress={() => onChange(tab)}
          style={[styles.tab, value === tab && styles.activeTab]}
        >
          <Text style={[styles.tabText, value === tab && styles.activeTabText]}>{tab}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 },
  tab: {
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  activeTab: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  tabText: { color: '#334155', fontWeight: '600' },
  activeTabText: { color: '#fff' },
});
