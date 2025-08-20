import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProgress {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  lastSessionDate: string;
  completedSessions: string[];
  favorites: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: string;
}

export interface Session {
  id: string;
  type: 'meditation' | 'sleep' | 'focus';
  duration: number;
  completedAt: string;
}

const STORAGE_KEYS = {
  USER_PROGRESS: '@user_progress',
  SESSIONS: '@sessions',
  PREFERENCES: '@preferences',
  REMINDERS: '@reminders',
};

export const StorageService = {
  async getUserProgress(): Promise<UserProgress> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
      return {
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        lastSessionDate: '',
        completedSessions: [],
        favorites: [],
        badges: [],
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        lastSessionDate: '',
        completedSessions: [],
        favorites: [],
        badges: [],
      };
    }
  },

  async updateUserProgress(progress: Partial<UserProgress>): Promise<void> {
    try {
      const current = await this.getUserProgress();
      const updated = { ...current, ...progress };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  },

  async recordSession(session: Session): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      const today = new Date().toDateString();
      const lastSession = new Date(progress.lastSessionDate).toDateString();
      
      let newStreak = progress.currentStreak;
      if (lastSession !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastSession === yesterday.toDateString()) {
          newStreak += 1;
        } else if (lastSession !== today) {
          newStreak = 1;
        }
      }

      await this.updateUserProgress({
        totalSessions: progress.totalSessions + 1,
        totalMinutes: progress.totalMinutes + session.duration,
        currentStreak: newStreak,
        lastSessionDate: new Date().toISOString(),
        completedSessions: [...progress.completedSessions, session.id],
      });

      const sessions = await this.getSessions();
      sessions.push(session);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

      await this.checkAndAwardBadges(progress.totalSessions + 1, progress.totalMinutes + session.duration, newStreak);
    } catch (error) {
      console.error('Error recording session:', error);
    }
  },

  async getSessions(): Promise<Session[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  async toggleFavorite(sessionId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      const favorites = progress.favorites || [];
      const index = favorites.indexOf(sessionId);
      
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(sessionId);
      }
      
      await this.updateUserProgress({ favorites });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  },

  async checkAndAwardBadges(totalSessions: number, totalMinutes: number, streak: number): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      const badges = [...progress.badges];
      const existingBadgeIds = badges.map(b => b.id);

      const potentialBadges: Badge[] = [
        {
          id: 'first_session',
          title: 'First Steps',
          description: 'Complete your first session',
          earnedDate: new Date().toISOString(),
          icon: 'star',
        },
        {
          id: 'week_streak',
          title: 'Week Warrior',
          description: '7 day streak',
          earnedDate: new Date().toISOString(),
          icon: 'flame',
        },
        {
          id: 'ten_sessions',
          title: 'Dedicated',
          description: 'Complete 10 sessions',
          earnedDate: new Date().toISOString(),
          icon: 'trophy',
        },
        {
          id: 'five_hours',
          title: 'Time Investor',
          description: 'Meditate for 5 hours total',
          earnedDate: new Date().toISOString(),
          icon: 'time',
        },
      ];

      if (totalSessions >= 1 && !existingBadgeIds.includes('first_session')) {
        badges.push(potentialBadges[0]);
      }
      if (streak >= 7 && !existingBadgeIds.includes('week_streak')) {
        badges.push(potentialBadges[1]);
      }
      if (totalSessions >= 10 && !existingBadgeIds.includes('ten_sessions')) {
        badges.push(potentialBadges[2]);
      }
      if (totalMinutes >= 300 && !existingBadgeIds.includes('five_hours')) {
        badges.push(potentialBadges[3]);
      }

      if (badges.length > progress.badges.length) {
        await this.updateUserProgress({ badges });
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  },

  async getPreferences(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {};
    }
  },

  async setPreferences(preferences: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error setting preferences:', error);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};