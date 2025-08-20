import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import { AVPlaybackStatus } from 'expo-av';
import audioService, { AudioTrack, AudioError } from '../services/audioService';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface MeditationPlayerProps {
  visible: boolean;
  track: AudioTrack | null;
  onClose: () => void;
}

export default function MeditationPlayer({ visible, track, onClose }: MeditationPlayerProps) {
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AudioError | null>(null);

  useEffect(() => {
    if (visible && track) {
      loadTrack();
    }

    return () => {
      if (!visible) {
        audioService.cleanup();
      }
    };
  }, [visible, track]);

  const loadTrack = async () => {
    if (!track) return;

    setIsLoading(true);
    setError(null);
    
    const success = await audioService.loadAndPlayTrack(
      track, 
      onPlaybackStatusUpdate,
      handleAudioError
    );
    
    if (success) {
      setIsPlaying(true);
      setDuration(track.duration * 1000);
    }
    setIsLoading(false);
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
      
      if (status.durationMillis) {
        setDuration(status.durationMillis);
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

  const handleSeek = async (value: number) => {
    await audioService.setPosition(value);
    setCurrentPosition(value);
  };

  const handleVolumeChange = async (value: number) => {
    await audioService.setVolume(value);
    setVolume(value);
  };

  const handleSkipForward = async () => {
    const newPosition = Math.min(currentPosition + 15000, duration);
    await handleSeek(newPosition);
  };

  const handleSkipBackward = async () => {
    const newPosition = Math.max(currentPosition - 15000, 0);
    await handleSeek(newPosition);
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAudioError = (audioError: AudioError) => {
    setError(audioError);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleRetry = () => {
    setError(null);
    loadTrack();
  };

  const handleBack = () => {
    // Since this is a modal player, the back button should close the modal
    // but keep the audio playing (typical music player behavior)
    onClose();
  };

  const handleClose = () => {
    audioService.stop();
    onClose();
  };

  if (!track) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a1a2e', '#0f0f1e']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Now Playing</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning-outline" size={48} color="#FF6B6B" />
                  <Text style={styles.errorTitle}>Unable to Play Audio</Text>
                  <Text style={styles.errorMessage}>{error.message}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <LinearGradient
                      colors={['#6B4EFF', '#9B59B6']}
                      style={styles.retryGradient}
                    >
                      <Text style={styles.retryText}>Try Again</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
              <>
              <View style={styles.artwork}>
                <LinearGradient
                  colors={['#6B4EFF', '#9B59B6']}
                  style={styles.artworkGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="headset" size={120} color="rgba(255,255,255,0.8)" />
                </LinearGradient>
              </View>

              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackArtist}>Guided Meditation</Text>
              </View>

              <View style={styles.progressContainer}>
                <Slider
                  style={styles.slider}
                  value={currentPosition}
                  minimumValue={0}
                  maximumValue={duration}
                  minimumTrackTintColor="#6B4EFF"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#FFFFFF"
                  onSlidingComplete={handleSeek}
                />
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>{formatTime(currentPosition)}</Text>
                  <Text style={styles.time}>{formatTime(duration)}</Text>
                </View>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity onPress={handleSkipBackward} style={styles.controlButton}>
                  <Ionicons name="play-skip-back" size={28} color="#FFFFFF" />
                  <Text style={styles.skipText}>15s</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={styles.playButton}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#6B4EFF', '#9B59B6']}
                    style={styles.playButtonGradient}
                  >
                    {isLoading ? (
                      <Ionicons name="hourglass" size={32} color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={32}
                        color="#FFFFFF"
                        style={{ marginLeft: isPlaying ? 0 : 4 }}
                      />
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSkipForward} style={styles.controlButton}>
                  <Ionicons name="play-skip-forward" size={28} color="#FFFFFF" />
                  <Text style={styles.skipText}>15s</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.volumeContainer}>
                <Ionicons name="volume-low" size={20} color="#8E8E93" />
                <Slider
                  style={styles.volumeSlider}
                  value={volume}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#6B4EFF"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#FFFFFF"
                  onValueChange={handleVolumeChange}
                />
                <Ionicons name="volume-high" size={20} color="#8E8E93" />
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="moon-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Sleep Timer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Favorite</Text>
                </TouchableOpacity>
              </View>
              </>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-evenly',
  },
  artwork: {
    alignItems: 'center',
    marginTop: 20,
  },
  artworkGradient: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#6B4EFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  trackInfo: {
    alignItems: 'center',
    marginTop: 30,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 16,
    color: '#8E8E93',
  },
  progressContainer: {
    marginTop: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  playButton: {
    marginHorizontal: 30,
  },
  playButtonGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#6B4EFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 10,
  },
  retryGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});