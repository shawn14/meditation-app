import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Slider,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface AudioPlayerProps {
  source: string;
  title: string;
  artist?: string;
  onClose?: () => void;
}

export default function AudioPlayer({ source, title, artist, onClose }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [source]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: source },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(sound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    if (!sound) return;
    await sound.setPositionAsync(value);
  };

  const handleSpeedChange = async () => {
    if (!sound) return;
    
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    await sound.setRateAsync(nextSpeed, true);
    setPlaybackSpeed(nextSpeed);
  };

  const handleSkip = async (seconds: number) => {
    if (!sound) return;
    const newPosition = Math.max(0, Math.min(duration, position + seconds * 1000));
    await sound.setPositionAsync(newPosition);
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1C1C1E', '#0A0A0C']}
        style={styles.gradient}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.artwork}>
          <LinearGradient
            colors={['#6B4EFF', '#9B59B6']}
            style={styles.artworkGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="headset" size={64} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          {artist && <Text style={styles.artist}>{artist}</Text>}
        </View>

        <View style={styles.progressContainer}>
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
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => handleSkip(-15)}>
            <View style={styles.skipButton}>
              <Ionicons name="play-back" size={20} color="#FFFFFF" />
              <Text style={styles.skipText}>15</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="#FFFFFF"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSkip(15)}>
            <View style={styles.skipButton}>
              <Ionicons name="play-forward" size={20} color="#FFFFFF" />
              <Text style={styles.skipText}>15</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.bottomButton} onPress={handleSpeedChange}>
            <Text style={styles.speedText}>{playbackSpeed}x</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomButton}>
            <Ionicons name="moon-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomButton}>
            <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomButton}>
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  artwork: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  artworkGradient: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#8E8E93',
  },
  progressContainer: {
    marginBottom: 40,
  },
  slider: {
    width: width - 40,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    gap: 40,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  skipText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomButton: {
    padding: 10,
  },
  speedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});