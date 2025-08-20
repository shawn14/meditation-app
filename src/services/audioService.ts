import { Audio, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import audioCacheService from './audioCacheService';

interface AudioTrack {
  id: string;
  title: string;
  uri: string;
  duration: number;
}

export interface AudioError {
  code: 'LOAD_FAILED' | 'PLAYBACK_ERROR' | 'NETWORK_ERROR' | 'PERMISSION_DENIED';
  message: string;
  originalError?: any;
}

class AudioService {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;
  private currentTrack: AudioTrack | null = null;
  private playbackStatusCallback: ((status: AVPlaybackStatus) => void) | null = null;
  private sessionStartTime: number = 0;
  private errorCallback: ((error: AudioError) => void) | null = null;

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

  async loadAndPlayTrack(
    track: AudioTrack, 
    onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void,
    onError?: (error: AudioError) => void
  ): Promise<boolean> {
    try {
      this.errorCallback = onError || null;
      
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Try to get cached version first
      let audioUri = track.uri;
      let isUsingCache = false;
      
      try {
        const cachedPath = await audioCacheService.getCachedAudio(track.id);
        if (cachedPath) {
          audioUri = cachedPath;
          isUsingCache = true;
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
      } catch (cacheError) {
        console.log('Cache check failed, using original URL:', cacheError);
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
    } catch (error: any) {
      console.error('Error loading audio:', error);
      
      let audioError: AudioError;
      
      if (error.message?.includes('network') || error.message?.includes('internet')) {
        audioError = {
          code: 'NETWORK_ERROR',
          message: 'Unable to load audio. Please check your internet connection.',
          originalError: error
        };
      } else if (error.message?.includes('permission')) {
        audioError = {
          code: 'PERMISSION_DENIED',
          message: 'Audio permissions are required to play content.',
          originalError: error
        };
      } else {
        audioError = {
          code: 'LOAD_FAILED',
          message: 'Failed to load audio. Please try again.',
          originalError: error
        };
      }
      
      this.errorCallback?.(audioError);
      return false;
    }
  }

  private onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (this.playbackStatusCallback) {
      this.playbackStatusCallback(status);
    }

    if (status.isLoaded) {
      if (status.didJustFinish) {
        this.handleSessionComplete();
      }
      
      // Check for playback errors
      if (status.error) {
        console.error('Playback error:', status.error);
        this.errorCallback?.({
          code: 'PLAYBACK_ERROR',
          message: 'An error occurred during playback.',
          originalError: status.error
        });
      }
    }
  }

  async play() {
    try {
      if (this.sound) {
        await this.sound.playAsync();
        this.isPlaying = true;
        if (!this.sessionStartTime) {
          this.sessionStartTime = Date.now();
        }
      }
    } catch (error: any) {
      console.error('Error playing audio:', error);
      this.errorCallback?.({
        code: 'PLAYBACK_ERROR',
        message: 'Failed to play audio. Please try again.',
        originalError: error
      });
    }
  }

  async pause() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (error: any) {
      console.error('Error pausing audio:', error);
      this.errorCallback?.({
        code: 'PLAYBACK_ERROR',
        message: 'Failed to pause audio.',
        originalError: error
      });
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
    try {
      if (this.sound) {
        await this.sound.setPositionAsync(position);
      }
    } catch (error: any) {
      console.error('Error setting position:', error);
      this.errorCallback?.({
        code: 'PLAYBACK_ERROR',
        message: 'Failed to seek to position.',
        originalError: error
      });
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
export type { AudioTrack, AudioError };