import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface ReminderSettings {
  morningEnabled: boolean;
  morningTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
  mindfulMomentsEnabled: boolean;
  mindfulMomentsTimes: string[];
}

const DEFAULT_REMINDERS: ReminderSettings = {
  morningEnabled: true,
  morningTime: '08:00',
  eveningEnabled: true,
  eveningTime: '21:00',
  mindfulMomentsEnabled: false,
  mindfulMomentsTimes: ['12:00', '15:00', '18:00'],
};

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    
    return true;
  },

  async scheduleDaily(title: string, body: string, hour: number, minute: number): Promise<string> {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        badge: 1,
        data: { type: 'daily_reminder' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    
    return identifier;
  },

  async scheduleMindfulMoment(): Promise<void> {
    const messages = [
      { title: 'Mindful Moment', body: 'Take a deep breath and check in with yourself' },
      { title: 'Time to Pause', body: 'A moment of mindfulness awaits you' },
      { title: 'Be Present', body: 'Take 3 minutes to center yourself' },
      { title: 'Quick Reset', body: 'Ready for a mindful break?' },
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    await Notifications.scheduleNotificationAsync({
      content: {
        ...randomMessage,
        sound: true,
        data: { type: 'mindful_moment' },
      },
      trigger: {
        seconds: 60 * 60 * 3, // 3 hours from now
      },
    });
  },

  async setupReminders(settings?: ReminderSettings): Promise<void> {
    const reminders = settings || DEFAULT_REMINDERS;
    
    await this.cancelAllNotifications();
    
    if (reminders.morningEnabled) {
      const [hour, minute] = reminders.morningTime.split(':').map(Number);
      await this.scheduleDaily(
        'Good Morning',
        'Start your day with intention. Your meditation awaits.',
        hour,
        minute
      );
    }
    
    if (reminders.eveningEnabled) {
      const [hour, minute] = reminders.eveningTime.split(':').map(Number);
      await this.scheduleDaily(
        'Evening Wind Down',
        'Time to relax and prepare for restful sleep.',
        hour,
        minute
      );
    }
    
    if (reminders.mindfulMomentsEnabled) {
      for (const time of reminders.mindfulMomentsTimes) {
        const [hour, minute] = time.split(':').map(Number);
        await this.scheduleDaily(
          'Mindful Moment',
          'Take a brief pause to reconnect with yourself.',
          hour,
          minute
        );
      }
    }
    
    await AsyncStorage.setItem('@reminder_settings', JSON.stringify(reminders));
  },

  async getReminderSettings(): Promise<ReminderSettings> {
    try {
      const settings = await AsyncStorage.getItem('@reminder_settings');
      return settings ? JSON.parse(settings) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  },

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async sendStreakReminder(streak: number): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${streak} Day Streak! 🔥`,
        body: "Don't break your streak! Continue your practice today.",
        sound: true,
        data: { type: 'streak_reminder', streak },
      },
      trigger: null,
    });
  },

  async sendAchievementNotification(achievement: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Achievement Unlocked! 🏆',
        body: achievement,
        sound: true,
        data: { type: 'achievement' },
      },
      trigger: null,
    });
  },

  async sendSessionComplete(duration: number, type: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Great Job! ✨',
        body: `You completed a ${duration} minute ${type} session`,
        sound: false,
        data: { type: 'session_complete', duration, sessionType: type },
      },
      trigger: null,
    });
  },

  listenForNotifications(callback: (notification: Notifications.Notification) => void): () => void {
    const subscription = Notifications.addNotificationReceivedListener(callback);
    return () => subscription.remove();
  },

  listenForNotificationResponses(callback: (response: Notifications.NotificationResponse) => void): () => void {
    const subscription = Notifications.addNotificationResponseReceivedListener(callback);
    return () => subscription.remove();
  },
};