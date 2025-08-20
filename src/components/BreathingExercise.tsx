import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface BreathingExerciseProps {
  visible: boolean;
  onClose: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function BreathingExercise({ visible, onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  // 4-7-8 breathing technique timings (in seconds)
  const timings = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 2,
  };

  const phaseColors = {
    inhale: ['#4ECDC4', '#44A08D'],
    hold: ['#6B4EFF', '#9B59B6'],
    exhale: ['#FF6B6B', '#FF8E53'],
    rest: ['#718096', '#4A5568'],
  };

  const phaseInstructions = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Rest',
  };

  useEffect(() => {
    if (!visible) {
      setIsActive(false);
      setPhase('inhale');
      setCountdown(timings.inhale);
      setCycles(0);
    }
  }, [visible]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    if (isActive) {
      // Start animation for current phase
      animatePhase(phase);

      // Countdown timer
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return timings[getNextPhase(phase)];
          }
          return prev - 1;
        });
      }, 1000);

      // Phase transition
      phaseTimeout = setTimeout(() => {
        const nextPhase = getNextPhase(phase);
        setPhase(nextPhase);
        
        if (nextPhase === 'inhale') {
          setCycles(prev => prev + 1);
        }
      }, timings[phase] * 1000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(phaseTimeout);
    };
  }, [isActive, phase]);

  const getNextPhase = (currentPhase: BreathingPhase): BreathingPhase => {
    switch (currentPhase) {
      case 'inhale': return 'hold';
      case 'hold': return 'exhale';
      case 'exhale': return 'rest';
      case 'rest': return 'inhale';
    }
  };

  const animatePhase = (currentPhase: BreathingPhase) => {
    switch (currentPhase) {
      case 'inhale':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: timings.inhale * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: timings.inhale * 1000,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      
      case 'hold':
        // Keep current scale and opacity
        break;
      
      case 'exhale':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.5,
            duration: timings.exhale * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: timings.exhale * 1000,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      
      case 'rest':
        // Keep at small scale
        break;
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCountdown(timings.inhale);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(timings.inhale);
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0.8);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={90} style={styles.blurContainer}>
          <LinearGradient
            colors={['rgba(10,10,12,0.9)', 'rgba(10,10,12,0.95)']}
            style={styles.gradient}
          >
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => {
                handleStop();
                onClose();
              }}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.content}>
              <Text style={styles.title}>4-7-8 Breathing</Text>
              <Text style={styles.subtitle}>
                Inhale for 4 • Hold for 7 • Exhale for 8
              </Text>

              {cycles > 0 && (
                <Text style={styles.cycles}>Cycles completed: {cycles}</Text>
              )}

              <View style={styles.animationContainer}>
                <Animated.View
                  style={[
                    styles.breathingCircle,
                    {
                      transform: [{ scale: scaleAnim }],
                      opacity: opacityAnim,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={phaseColors[phase]}
                    style={styles.circleGradient}
                  >
                    <Text style={styles.countdownText}>{countdown}</Text>
                  </LinearGradient>
                </Animated.View>
              </View>

              <Text style={styles.instruction}>
                {phaseInstructions[phase]}
              </Text>

              {!isActive ? (
                <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                  <LinearGradient
                    colors={['#6B4EFF', '#9B59B6']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Start Exercise</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                  <Text style={styles.stopButtonText}>Stop</Text>
                </TouchableOpacity>
              )}

              <View style={styles.benefits}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                <Text style={styles.benefitsText}>
                  • Reduces anxiety and stress{'\n'}
                  • Helps you fall asleep faster{'\n'}
                  • Lowers heart rate and blood pressure{'\n'}
                  • Activates parasympathetic nervous system
                </Text>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
    textAlign: 'center',
  },
  cycles: {
    fontSize: 14,
    color: '#6B4EFF',
    marginBottom: 30,
  },
  animationContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  breathingCircle: {
    width: 200,
    height: 200,
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instruction: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  startButton: {
    marginBottom: 40,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 40,
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  benefits: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  benefitsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#8E8E93',
  },
});