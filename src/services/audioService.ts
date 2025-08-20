import { Audio, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import audioCacheService from './audioCacheService';

interface AudioTrack {
  id: string;
  title: string;
  uri: string;
  duration: number;
}

class AudioService {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;
  private currentTrack: AudioTrack | null = null;
  private playbackStatusCallback: ((status: AVPlaybackStatus) => void) | null = null;
  private sessionStartTime: number = 0;

  constructor() {
    this.configureAudioMode();
  }

  private async configureAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error configuring audio mode:', error);
    }
  }

  async loadAndPlayTrack(track: AudioTrack, onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Try to get cached version first
      let audioUri = track.uri;
      const cachedPath = await audioCacheService.getCachedAudio(track.id);
      
      if (cachedPath) {
        audioUri = cachedPath;
        console.log(`Playing cached audio for ${track.title}`);
      } else {
        console.log(`Streaming audio for ${track.title}`);
        // Optionally cache in background
        audioCacheService.cacheAudio({
          id: track.id,
          title: track.title,
          uri: track.uri,
          duration: track.duration,
          artist: '',
          category: 'meditation',
          license: 'CC-BY',
        }).catch(err => console.log('Background cache failed:', err));
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        this.onPlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
      this.currentTrack = track;
      this.isPlaying = true;
      this.sessionStartTime = Date.now();
      this.playbackStatusCallback = onPlaybackStatusUpdate || null;

      return true;
    } catch (error) {
      console.error('Error loading audio:', error);
      return false;
    }
  }

  private onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (this.playbackStatusCallback) {
      this.playbackStatusCallback(status);
    }

    if (status.isLoaded && status.didJustFinish) {
      this.handleSessionComplete();
    }
  }

  async play() {
    if (this.sound) {
      await this.sound.playAsync();
      this.isPlaying = true;
      if (!this.sessionStartTime) {
        this.sessionStartTime = Date.now();
      }
    }
  }

  async pause() {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    }
  }

  async stop() {
    if (this.sound) {
      await this.sound.stopAsync();
      this.isPlaying = false;
      this.handleSessionComplete();
    }
  }

  async setPosition(position: number) {
    if (this.sound) {
      await this.sound.setPositionAsync(position);
    }
  }

  async setVolume(volume: number) {
    if (this.sound) {
      await this.sound.setVolumeAsync(volume);
    }
  }

  async getStatus(): Promise<AVPlaybackStatus | null> {
    if (this.sound) {
      return await this.sound.getStatusAsync();
    }
    return null;
  }

  private async handleSessionComplete() {
    if (this.currentTrack && this.sessionStartTime) {
      const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      await this.saveSessionToHistory(this.currentTrack, sessionDuration);
      this.sessionStartTime = 0;
    }
  }

  private async saveSessionToHistory(track: AudioTrack, duration: number) {
    try {
      const historyKey = 'meditation_history';
      const existingHistory = await AsyncStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      history.push({
        trackId: track.id,
        trackTitle: track.title,
        completedAt: new Date().toISOString(),
        duration: duration,
      });

      await AsyncStorage.setItem(historyKey, JSON.stringify(history));
      
      // Update stats
      await this.updateUserStats(duration);
    } catch (error) {
      console.error('Error saving session history:', error);
    }
  }

  private async updateUserStats(sessionDuration: number) {
    try {
      const statsKey = 'user_stats';
      const existingStats = await AsyncStorage.getItem(statsKey);
      const stats = existingStats ? JSON.parse(existingStats) : {
        totalMinutes: 0,
        currentStreak: 0,
        lastSessionDate: null,
      };

      stats.totalMinutes += Math.floor(sessionDuration / 60);
      
      // Update streak
      const today = new Date().toDateString();
      const lastSession = stats.lastSessionDate ? new Date(stats.lastSessionDate).toDateString() : null;
      
      if (lastSession !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastSession === yesterday.toDateString()) {
          stats.currentStreak += 1;
        } else {
          stats.currentStreak = 1;
        }
      }
      
      stats.lastSessionDate = new Date().toISOString();
      
      await AsyncStorage.setItem(statsKey, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
      this.currentTrack = null;
      this.isPlaying = false;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }
}

export default new AudioService();
export type { AudioTrack };