import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptic feedback utility functions
export const haptics = {
  // Light impact - for subtle interactions like hover states
  light: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  // Medium impact - for standard button presses
  medium: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  // Heavy impact - for important actions or confirmations
  heavy: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  // Success notification - for completed actions
  success: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }
  },

  // Warning notification - for alerts or cautions
  warning: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );
    }
  },

  // Error notification - for failed actions
  error: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    }
  },

  // Selection change - for picker selections, sliders, etc.
  selection: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.selectionAsync();
    }
  },

  // Custom pattern for meditation start/stop
  meditationStart: async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 100);
    }
  },

  // Breathing exercise haptic pattern
  breathingIn: async () => {
    if (Platform.OS === 'ios') {
      // Gradual increase
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 1000);
    }
  },

  breathingOut: async () => {
    if (Platform.OS === 'ios') {
      // Gradual decrease
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 1000);
    }
  },
};

// HOC to add haptic feedback to TouchableOpacity
export function withHaptics(
  Component: any,
  hapticType: keyof typeof haptics = 'medium'
) {
  return (props: any) => {
    const handlePress = async (event: any) => {
      await haptics[hapticType]();
      if (props.onPress) {
        props.onPress(event);
      }
    };

    return <Component {...props} onPress={handlePress} />;
  };
}