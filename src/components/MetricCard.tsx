import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type MetricCardProps = {
  value: string;
  label: string;
};

export function MetricCard({ value, label }: MetricCardProps) {
  return (
    <View accessibilityLabel={`${label}: ${value}`} style={styles.box}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    // `flexBasis` starts sibling cards at equal width; `minWidth` decides when they wrap.
    flex: 1,
    minWidth: 140,
    flexBasis: 0,
    backgroundColor: '#2a2320',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#43342d',
  },
  value: { fontWeight: '700', fontSize: 18, color: '#ff8f57' },
  label: { color: '#d7c0b4', fontSize: 12, marginTop: 2 },
});
