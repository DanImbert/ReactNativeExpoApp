import React from 'react';
import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress) }}
      style={styles.track}
    >
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(progress, 100))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#43342d',
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: '#ff7a3d',
  },
});
