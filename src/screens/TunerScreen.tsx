import React from 'react';
import { Button, Pressable, Text, View } from 'react-native';

import { ProgressBar } from '../components/ProgressBar';
import { strings } from '../data/mockData';
import { appStyles } from '../styles/appStyles';
import type { StringTarget } from '../types/app';
import { getTuningStatus } from '../utils/analytics';

type TunerScreenProps = {
  detectedFreq: number;
  onCalibrate: () => void;
  onNudgeFlat: () => void;
  onNudgeSharp: () => void;
  onPracticeMode: () => void;
  onSelectString: (next: StringTarget) => void;
  selectedString: StringTarget;
  tuningOffset: number;
};

export function TunerScreen({
  detectedFreq,
  onCalibrate,
  onNudgeFlat,
  onNudgeSharp,
  onPracticeMode,
  onSelectString,
  selectedString,
  tuningOffset,
}: TunerScreenProps) {
  return (
    <View style={appStyles.card} testID="tuner-screen">
      <Text style={appStyles.sectionTitle}>Realtime Tuner</Text>
      <Text style={appStyles.cardSubtitle}>
        A simulated tuner with directional feedback and quick adjustments.
      </Text>
      <View style={appStyles.tunerPanel}>
        <Text style={appStyles.noteLabel}>Selected String</Text>
        <Text style={appStyles.noteValue}>{selectedString.name}</Text>
        <View style={appStyles.stringRow}>
          {strings.map((string) => (
            <Pressable
              accessibilityHint="Sets the selected string for the tuner"
              accessibilityLabel={`Tune ${string.name}`}
              accessibilityRole="button"
              key={string.name}
              onPress={() => onSelectString(string)}
              style={[
                appStyles.stringButton,
                selectedString.name === string.name && appStyles.stringButtonActive,
              ]}
            >
              <Text
                style={[
                  appStyles.stringText,
                  selectedString.name === string.name && appStyles.stringTextActive,
                ]}
              >
                {string.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={appStyles.tunerStatus}>
          <Text style={appStyles.statusLabel}>Target</Text>
          <Text style={appStyles.statusValue}>{selectedString.target.toFixed(1)} Hz</Text>
          <Text style={appStyles.statusLabel}>Detected</Text>
          <Text style={appStyles.statusValue}>{detectedFreq.toFixed(1)} Hz</Text>
          <Text
            accessibilityLabel={`Tuning status: ${getTuningStatus(tuningOffset)} ${tuningOffset > 0 ? 'plus' : ''}${tuningOffset} hertz`}
            style={appStyles.statusHint}
          >
            Status: {getTuningStatus(tuningOffset)} ({tuningOffset > 0 ? '+' : ''}
            {tuningOffset} Hz)
          </Text>
          <ProgressBar
            progress={Math.max(0, 100 - Math.min(Math.abs(tuningOffset) * 18, 100))}
          />
        </View>
      </View>
      <View style={appStyles.buttonRow}>
        <View style={appStyles.buttonCell}>
          <Button onPress={onCalibrate} title="Calibrate" />
        </View>
        <View style={appStyles.buttonCell}>
          <Button onPress={onNudgeFlat} title="Nudge Flat" />
        </View>
        <View style={appStyles.buttonCell}>
          <Button onPress={onNudgeSharp} title="Nudge Sharp" />
        </View>
      </View>
      <View style={appStyles.secondaryButtonRow}>
        <Button onPress={onPracticeMode} title="Practice Mode" />
      </View>
    </View>
  );
}
