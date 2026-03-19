import React from 'react';
import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(progress, 100))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#dbeafe',
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
});
