import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { openSourceAudioLibrary, audioCategories, getFeaturedAudio } from '../data/openSourceAudio';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  title: string;
  icon: string;
  count: number;
  gradient: string[];
}

interface Meditation {
  id: string;
  title: string;
  duration: string;
  instructor: string;
  isLocked: boolean;
  isPro: boolean;
  description: string;
  benefits: string[];
  audioUrl: string;
}

export default function MeditateScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories: Category[] = [
    { id: 'all', title: 'All', icon: 'apps', count: openSourceAudioLibrary.length, gradient: ['#6B4EFF', '#9B59B6'] },
    { id: 'nature', title: 'Nature', icon: 'leaf', count: openSourceAudioLibrary.filter(a => a.category === 'nature').length, gradient: ['#4ECDC4', '#44A08D'] },
    { id: 'meditation', title: 'Meditation', icon: 'flower', count: openSourceAudioLibrary.filter(a => a.category === 'meditation').length, gradient: ['#667eea', '#764ba2'] },
    { id: 'ambient', title: 'Ambient', icon: 'musical-notes', count: openSourceAudioLibrary.filter(a => a.category === 'ambient').length, gradient: ['#FF6B6B', '#FF8E53'] },
    { id: 'sleep', title: 'Sleep', icon: 'moon', count: openSourceAudioLibrary.filter(a => a.tags?.includes('sleep')).length, gradient: ['#2E3192', '#1BFFFF'] },
  ];

  // Map open source audio to meditation format
  const featuredAudio = getFeaturedAudio();
  const meditations: Meditation[] = featuredAudio.map((audio, index) => ({
    id: audio.id,
    title: audio.title,
    duration: Math.floor(audio.duration / 60).toString(), // Convert seconds to minutes
    instructor: audio.artist,
    isLocked: index > 3, // First 4 are unlocked
    isPro: index > 1, // First 2 are free
    description: `Experience the calming effects of ${audio.title.toLowerCase()}. ${audio.attribution ? 'Audio: ' + audio.attribution : ''}`,
    benefits: audio.tags || [],
    audioUrl: audio.uri
  }));

  // Add some additional meditations using other audio sources
  const additionalMeditations: Meditation[] = [
    {
      id: 'forest-1',
      title: openSourceAudioLibrary.find(a => a.id === 'forest-ambience-1')?.title || 'Forest Ambience',
      duration: '12',
      instructor: 'Nature Sounds',
      isLocked: false,
      isPro: false,
      description: 'Immerse yourself in the peaceful sounds of nature.',
      benefits: ['Reduces stress', 'Improves focus', 'Natural relaxation'],
      audioUrl: openSourceAudioLibrary.find(a => a.id === 'forest-ambience-1')?.uri || ''
    },
    {
      id: 'white-noise-focus',
      title: 'Focus with White Noise',
      duration: '10',
      instructor: 'Sound Therapy',
      isLocked: false,
      isPro: true,
      description: 'Use the power of white noise to enhance concentration.',
      benefits: ['Better focus', 'Blocks distractions', 'Improves productivity'],
      audioUrl: openSourceAudioLibrary.find(a => a.id === 'white-noise-1')?.uri || ''
    }
  ];

  const allMeditations = [...meditations, ...additionalMeditations];

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <LinearGradient
        colors={selectedCategory === item.id ? item.gradient : ['#1C1C1E', '#1C1C1E']}
        style={styles.categoryGradient}
      >
        <Ionicons
          name={item.icon as any}
          size={24}
          color={selectedCategory === item.id ? '#FFFFFF' : '#8E8E93'}
        />
        <Text style={[
          styles.categoryTitle,
          selectedCategory === item.id && styles.selectedCategoryText
        ]}>
          {item.title}
        </Text>
        <Text style={[
          styles.categoryCount,
          selectedCategory === item.id && styles.selectedCategoryText
        ]}>
          {item.count}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMeditation = ({ item }: { item: Meditation }) => (
    <TouchableOpacity 
      style={styles.meditationCard}
      onPress={() => navigation.navigate('MeditationDetail', { meditation: item })}
    >
      <View style={styles.meditationInfo}>
        <View style={styles.meditationHeader}>
          <Text style={styles.meditationTitle}>{item.title}</Text>
          {item.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          )}
        </View>
        <Text style={styles.meditationInstructor}>{item.instructor}</Text>
        <Text style={styles.meditationDuration}>{item.duration}</Text>
      </View>
      <View style={styles.playContainer}>
        {item.isLocked ? (
          <Ionicons name="lock-closed" size={24} color="#8E8E93" />
        ) : (
          <View style={styles.playButton}>
            <Ionicons name="play" size={20} color="#FFFFFF" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Meditate</Text>
          <Text style={styles.subtitle}>Find your inner peace</Text>
        </View>

        <TouchableOpacity style={styles.dailyCard}>
          <LinearGradient
            colors={['#6B4EFF', '#9B59B6']}
            style={styles.dailyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.dailyContent}>
              <Ionicons name="today" size={32} color="#FFFFFF" />
              <View style={styles.dailyText}>
                <Text style={styles.dailyTitle}>Today's Meditation</Text>
                <Text style={styles.dailySubtitle}>Cultivating Gratitude • 15 min</Text>
              </View>
              <View style={styles.dailyPlay}>
                <Ionicons name="play-circle" size={48} color="#FFFFFF" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.meditationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={allMeditations}
            renderItem={renderMeditation}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  dailyCard: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  dailyGradient: {
    borderRadius: 20,
    padding: 20,
  },
  dailyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyText: {
    flex: 1,
    marginLeft: 15,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dailySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  dailyPlay: {
    marginLeft: 10,
  },
  categoriesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    marginRight: 12,
  },
  categoryGradient: {
    width: 100,
    height: 100,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategory: {
    transform: [{ scale: 1.05 }],
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 8,
  },
  categoryCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  meditationsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAll: {
    fontSize: 14,
    color: '#6B4EFF',
    fontWeight: '600',
  },
  meditationCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationInfo: {
    flex: 1,
  },
  meditationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  proBadge: {
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  proText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  meditationInstructor: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 3,
  },
  meditationDuration: {
    fontSize: 12,
    color: '#6B4EFF',
  },
  playContainer: {
    marginLeft: 15,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});