import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Skeleton loader component for content placeholders
export function SkeletonLoader({ 
  height = 20, 
  width: skeletonWidth = '100%',
  borderRadius = 8,
  style,
}: {
  height?: number;
  width?: number | string;
  borderRadius?: number;
  style?: any;
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          height,
          width: skeletonWidth,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Full screen loading spinner
export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6B4EFF" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

// Meditation card skeleton
export function MeditationCardSkeleton() {
  return (
    <View style={styles.meditationCardSkeleton}>
      <View style={styles.meditationCardLeft}>
        <SkeletonLoader height={18} width={'60%'} />
        <SkeletonLoader height={14} width={'40%'} style={{ marginTop: 8 }} />
        <SkeletonLoader height={12} width={'30%'} style={{ marginTop: 8 }} />
      </View>
      <SkeletonLoader height={44} width={44} borderRadius={22} />
    </View>
  );
}

// Category card skeleton
export function CategoryCardSkeleton() {
  return (
    <View style={styles.categoryCardSkeleton}>
      <SkeletonLoader height={100} width={100} borderRadius={20} />
    </View>
  );
}

// Sleep story card skeleton
export function SleepStoryCardSkeleton() {
  return (
    <View style={styles.sleepStoryCardSkeleton}>
      <SkeletonLoader height={160} width={width * 0.6} borderRadius={16} />
    </View>
  );
}

// Home screen skeleton
export function HomeScreenSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader height={32} width={'50%'} />
        <SkeletonLoader height={16} width={'30%'} style={{ marginTop: 10 }} />
      </View>

      <View style={styles.statsContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.statBox}>
            <SkeletonLoader height={20} width={'60%'} />
            <SkeletonLoader height={14} width={'40%'} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>

      <SkeletonLoader height={140} style={{ marginHorizontal: 20, marginBottom: 30 }} borderRadius={20} />

      <View style={{ paddingHorizontal: 20 }}>
        <SkeletonLoader height={20} width={'40%'} style={{ marginBottom: 15 }} />
        <MeditationCardSkeleton />
        <MeditationCardSkeleton />
      </View>
    </View>
  );
}

// Meditation screen skeleton
export function MeditationScreenSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader height={32} width={'40%'} />
        <SkeletonLoader height={16} width={'60%'} style={{ marginTop: 10 }} />
      </View>

      <SkeletonLoader height={140} style={{ marginHorizontal: 20, marginBottom: 30 }} borderRadius={20} />

      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <SkeletonLoader height={20} width={'30%'} style={{ marginBottom: 15 }} />
        <View style={{ flexDirection: 'row' }}>
          {[1, 2, 3, 4].map((i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <SkeletonLoader height={20} width={'40%'} style={{ marginBottom: 15 }} />
        {[1, 2, 3].map((i) => (
          <MeditationCardSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}

// Content loading wrapper with error handling
export function ContentLoader({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  emptyMessage = 'No content available',
  errorMessage = 'Failed to load content',
  children,
  skeleton,
}: {
  isLoading: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}) {
  if (isLoading) {
    return <>{skeleton || <LoadingSpinner />}</>;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0C',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 20,
  },
  skeleton: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  meditationCardSkeleton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meditationCardLeft: {
    flex: 1,
  },
  categoryCardSkeleton: {
    marginRight: 12,
  },
  sleepStoryCardSkeleton: {
    marginLeft: 20,
    marginRight: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6B4EFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});