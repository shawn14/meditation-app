import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color="#8E8E93" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <LinearGradient
            colors={['#6B4EFF', '#9B59B6']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Specific empty states for different scenarios

export function NoMeditationsEmpty() {
  return (
    <EmptyState
      icon="leaf-outline"
      title="No Meditations Yet"
      message="Start your mindfulness journey by exploring our meditation library"
      actionLabel="Browse Meditations"
    />
  );
}

export function NoFavoritesEmpty() {
  return (
    <EmptyState
      icon="heart-outline"
      title="No Favorites Yet"
      message="Save your favorite meditations and sleep stories to easily find them later"
    />
  );
}

export function NoHistoryEmpty() {
  return (
    <EmptyState
      icon="time-outline"
      title="No History Yet"
      message="Your meditation journey starts with the first session. Take a moment for yourself today."
      actionLabel="Start Meditating"
    />
  );
}

export function NoDownloadsEmpty() {
  return (
    <EmptyState
      icon="download-outline"
      title="No Downloads"
      message="Download meditations and sleep stories to enjoy offline, anywhere"
    />
  );
}

export function NoSearchResultsEmpty({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      icon="search-outline"
      title="No Results Found"
      message={`We couldn't find any meditations matching "${searchQuery}". Try different keywords or browse our categories.`}
    />
  );
}

export function NoNetworkEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon="wifi-outline"
      title="No Internet Connection"
      message="Please check your connection and try again"
      actionLabel="Retry"
      onAction={onRetry}
    />
  );
}

export function ErrorEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon="warning-outline"
      title="Something Went Wrong"
      message="We're having trouble loading this content. Please try again."
      actionLabel="Try Again"
      onAction={onRetry}
    />
  );
}

// Mini empty state for smaller containers
export function MiniEmptyState({ 
  message, 
  icon = "information-circle-outline" 
}: { 
  message: string; 
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.miniContainer}>
      <Ionicons name={icon} size={24} color="#8E8E93" />
      <Text style={styles.miniText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  miniContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  miniText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 12,
  },
});