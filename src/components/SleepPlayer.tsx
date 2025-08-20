import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import audioService, { AudioTrack } from '../services/audioService';
import { AVPlaybackStatus } from 'expo-av';

const { width, height } = Dimensions.get('window');

interface SleepPlayerProps {
  visible: boolean;
  track: AudioTrack | null;
  onClose: () => void;
}

export default function SleepPlayer({ visible, track, onClose }: SleepPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTimer, setShowTimer] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const timerOptions = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
  ];

  useEffect(() => {
    if (track && visible) {
      loadAndPlay();
    }
    return () => {
      if (!visible) {
        audioService.stop();
      }
    };
  }, [track, visible]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sleepTimer && remainingTime && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev && prev <= 1) {
            handleStop();
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sleepTimer, remainingTime]);

  const loadAndPlay = async () => {
    if (!track) return;
    
    const success = await audioService.loadAndPlayTrack(track, onPlaybackStatusUpdate);
    setIsPlaying(success);
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
      
      // Loop the sound for sleep
      if (status.didJustFinish && !status.isLooping) {
        audioService.loadAndPlayTrack(track!);
      }
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioService.pause();
    } else {
      await audioService.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = async () => {
    await audioService.stop();
    setSleepTimer(null);
    setRemainingTime(null);
    onClose();
  };

  const handleSeek = async (value: number) => {
    await audioService.setPosition(value);
    setPosition(value);
  };

  const handleVolumeChange = async (value: number) => {
    await audioService.setVolume(value);
    setVolume(value);
  };

  const handleTimerSelect = (minutes: number) => {
    setSleepTimer(minutes);
    setRemainingTime(minutes * 60);
    setShowTimer(false);
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (!track) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={90} style={styles.blurContainer}>
          <LinearGradient
            colors={['rgba(10,10,12,0.8)', 'rgba(10,10,12,0.95)']}
            style={styles.gradient}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="chevron-down" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.visualizer}>
                <LinearGradient
                  colors={['#4C51BF', '#667EEA']}
                  style={styles.waveGradient}
                >
                  <Ionicons name="water" size={64} color="rgba(255,255,255,0.8)" />
                </LinearGradient>
              </View>

              <Text style={styles.title}>{track.title}</Text>
              <Text style={styles.subtitle}>Sleep Soundscape</Text>

              {remainingTime && (
                <View style={styles.timerDisplay}>
                  <Ionicons name="timer-outline" size={20} color="#8E8E93" />
                  <Text style={styles.timerText}>
                    Sleep timer: {formatRemainingTime(remainingTime)}
                  </Text>
                </View>
              )}

              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Slider
                  style={styles.slider}
                  value={position}
                  minimumValue={0}
                  maximumValue={duration}
                  onSlidingComplete={handleSeek}
                  minimumTrackTintColor="#6B4EFF"
                  maximumTrackTintColor="#3E3E3E"
                  thumbTintColor="#FFFFFF"
                />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => setShowTimer(true)}
                >
                  <Ionicons 
                    name="timer-outline" 
                    size={28} 
                    color={sleepTimer ? '#6B4EFF' : '#FFFFFF'} 
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.playButton} 
                  onPress={handlePlayPause}
                >
                  <LinearGradient
                    colors={['#6B4EFF', '#9B59B6']}
                    style={styles.playGradient}
                  >
                    <Ionicons 
                      name={isPlaying ? 'pause' : 'play'} 
                      size={32} 
                      color="#FFFFFF" 
                      style={{ marginLeft: isPlaying ? 0 : 4 }}
                    />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={handleStop}
                >
                  <Ionicons name="stop" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.volumeContainer}>
                <Ionicons name="volume-low" size={20} color="#8E8E93" />
                <Slider
                  style={styles.volumeSlider}
                  value={volume}
                  minimumValue={0}
                  maximumValue={1}
                  onValueChange={handleVolumeChange}
                  minimumTrackTintColor="#6B4EFF"
                  maximumTrackTintColor="#3E3E3E"
                  thumbTintColor="#FFFFFF"
                />
                <Ionicons name="volume-high" size={20} color="#8E8E93" />
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </View>

      {/* Timer Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTimer}
        onRequestClose={() => setShowTimer(false)}
      >
        <TouchableOpacity 
          style={styles.timerModalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimer(false)}
        >
          <View style={styles.timerModal}>
            <Text style={styles.timerModalTitle}>Set Sleep Timer</Text>
            <View style={styles.timerOptions}>
              {timerOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.timerOption}
                  onPress={() => handleTimerSelect(option.value)}
                >
                  <Text style={styles.timerOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.timerCancelButton}
              onPress={() => {
                setSleepTimer(null);
                setRemainingTime(null);
                setShowTimer(false);
              }}
            >
              <Text style={styles.timerCancelText}>Clear Timer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    alignSelf: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  visualizer: {
    width: 160,
    height: 160,
    marginBottom: 40,
  },
  waveGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  timerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
    minWidth: 35,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  playButton: {
    marginHorizontal: 20,
  },
  playGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 15,
  },
  timerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerModal: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    maxWidth: 320,
  },
  timerModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timerOption: {
    width: '48%',
    backgroundColor: '#2C2C2E',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  timerOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  timerCancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  timerCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});