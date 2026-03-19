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
    <View accessibilityRole="tablist" style={styles.tabRow}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          accessibilityRole="tab"
          accessibilityLabel={`${tab} tab`}
          accessibilityHint={`Shows the ${tab.toLowerCase()} section`}
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
    borderColor: '#4c3a31',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#25201d',
  },
  activeTab: { backgroundColor: '#ff7a3d', borderColor: '#ff7a3d' },
  tabText: { color: '#f3ded4', fontWeight: '600' },
  activeTabText: { color: '#fff' },
});
