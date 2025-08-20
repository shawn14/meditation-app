import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { triggerHaptic } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface MeditationTimerProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const PRESET_TIMES = [
  { label: '3 min', minutes: 3 },
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '20 min', minutes: 20 },
  { label: '30 min', minutes: 30 },
];

export default function MeditationTimer({ visible, onClose, onComplete }: MeditationTimerProps) {
  const [selectedTime, setSelectedTime] = useState(10); // Default 10 minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            triggerHaptic('success');
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onComplete]);

  const handleStart = () => {
    triggerHaptic('light');
    setTimeRemaining(selectedTime * 60);
    setIsRunning(true);
  };

  const handlePause = () => {
    triggerHaptic('light');
    setIsRunning(false);
  };

  const handleReset = () => {
    triggerHaptic('light');
    setIsRunning(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeRemaining > 0 ? (timeRemaining / (selectedTime * 60)) : 1;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#8E8E93" />
          </TouchableOpacity>

          <Text style={styles.title}>Meditation Timer</Text>

          {timeRemaining === 0 ? (
            <>
              <Text style={styles.selectTimeText}>Select Duration</Text>
              <View style={styles.presetContainer}>
                {PRESET_TIMES.map((preset) => (
                  <TouchableOpacity
                    key={preset.minutes}
                    style={[
                      styles.presetButton,
                      selectedTime === preset.minutes && styles.presetButtonSelected,
                    ]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedTime(preset.minutes);
                    }}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        selectedTime === preset.minutes && styles.presetTextSelected,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <LinearGradient
                  colors={['#6B4EFF', '#9B59B6']}
                  style={styles.startGradient}
                >
                  <Ionicons name="play" size={24} color="#FFFFFF" />
                  <Text style={styles.startText}>Start Timer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.timerContainer}>
                <View style={styles.progressRing}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        height: `${progress * 100}%`,
                      },
                    ]}
                  />
                  <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
                </View>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={isRunning ? handlePause : handleStart}
                >
                  <Ionicons
                    name={isRunning ? 'pause' : 'play'}
                    size={32}
                    color="#6B4EFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
                  <Ionicons name="refresh" size={32} color="#FF6B6B" />
                </TouchableOpacity>
              </View>

              <View style={styles.bells}>
                <TouchableOpacity style={styles.bellOption}>
                  <Ionicons name="notifications-outline" size={20} color="#6B4EFF" />
                  <Text style={styles.bellText}>Bell at start</Text>
                  <Ionicons name="checkmark" size={20} color="#6B4EFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bellOption}>
                  <Ionicons name="notifications-outline" size={20} color="#6B4EFF" />
                  <Text style={styles.bellText}>Bell at end</Text>
                  <Ionicons name="checkmark" size={20} color="#6B4EFF" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width - 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  selectTimeText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  presetButtonSelected: {
    borderColor: '#6B4EFF',
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
  },
  presetText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  presetTextSelected: {
    color: '#6B4EFF',
  },
  startButton: {
    width: '100%',
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 10,
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timerContainer: {
    marginBottom: 40,
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6B4EFF',
    opacity: 0.2,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bells: {
    width: '100%',
    gap: 15,
  },
  bellOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  bellText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
});