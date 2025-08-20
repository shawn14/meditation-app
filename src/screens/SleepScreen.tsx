import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getSleepSoundscapes, getSleepAudio } from '../data/openSourceAudio';
import audioService from '../services/audioService';
import SleepPlayer from '../components/SleepPlayer';
import BreathingExercise from '../components/BreathingExercise';

const { width } = Dimensions.get('window');

interface SleepStory {
  id: string;
  title: string;
  narrator: string;
  duration: string;
  image: string;
  isPro: boolean;
}

interface SoundScape {
  id: string;
  title: string;
  icon: string;
  color: string;
  audioSource?: any;
}

export default function SleepScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('stories');
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [showSleepPlayer, setShowSleepPlayer] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [showBreathing, setShowBreathing] = useState(false);

  // Get real audio sources
  const soundscapes = getSleepSoundscapes();
  const sleepAudioSources = getSleepAudio();

  // Map sleep audio to story format
  const sleepStories: SleepStory[] = [
    { 
      id: 'ambient-1', 
      title: sleepAudioSources.find(a => a.id === 'ambient-1')?.title || 'Cosmic Dreams', 
      narrator: 'Ambient Collection', 
      duration: '7 min', 
      image: '#4A5568', 
      isPro: false 
    },
    { 
      id: 'ambient-2', 
      title: sleepAudioSources.find(a => a.id === 'ambient-2')?.title || 'Ethereal Journey', 
      narrator: 'Ambient Soundscapes', 
      duration: '6 min', 
      image: '#2D3748', 
      isPro: false 
    },
    { 
      id: 'rain-1', 
      title: 'Rain Sleep Story', 
      narrator: 'Nature Sounds', 
      duration: '10 min', 
      image: '#1A365D', 
      isPro: true 
    },
    { 
      id: 'ocean-waves-1', 
      title: 'Ocean Dreams', 
      narrator: 'Nature Recordings', 
      duration: '8 min', 
      image: '#553C9A', 
      isPro: true 
    },
    { 
      id: 'forest-ambience-1', 
      title: 'Forest Night', 
      narrator: 'Field Recordings', 
      duration: '12 min', 
      image: '#2C5282', 
      isPro: false 
    },
  ];

  const handlePlayStory = (story: SleepStory) => {
    const audioSource = sleepAudioSources.find(a => a.id === story.id);
    if (audioSource) {
      navigation.navigate('MeditationDetail', { 
        meditation: {
          id: story.id,
          title: story.title,
          duration: story.duration.replace(' min', ''),
          instructor: story.narrator,
          description: `A relaxing sleep story featuring ${audioSource.title}. ${audioSource.attribution ? 'Audio: ' + audioSource.attribution : ''}`,
          benefits: ['Better sleep', 'Relaxation', 'Stress relief'],
          audioUrl: audioSource.uri,
          isPro: story.isPro
        }
      });
    }
  };

  const renderSleepStory = (story: SleepStory) => (
    <TouchableOpacity 
      key={story.id} 
      style={styles.storyCard}
      onPress={() => handlePlayStory(story)}
    >
      <View style={[styles.storyImage, { backgroundColor: story.image }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.storyGradient}
        >
          {story.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          )}
          <View style={styles.storyInfo}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storyNarrator}>{story.narrator}</Text>
            <View style={styles.storyMeta}>
              <Ionicons name="time-outline" size={14} color="#FFFFFF" />
              <Text style={styles.storyDuration}>{story.duration}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const handlePlaySound = async (sound: SoundScape) => {
    if (!sound.audioSource) return;
    
    setCurrentTrack({
      id: sound.audioSource.id,
      title: sound.title,
      uri: sound.audioSource.uri,
      duration: sound.audioSource.duration,
    });
    setShowSleepPlayer(true);
    setPlayingSound(sound.id);
  };

  const renderSoundscape = (sound: SoundScape) => (
    <TouchableOpacity 
      key={sound.id} 
      style={[styles.soundCard, playingSound === sound.id && styles.soundCardActive]}
      onPress={() => handlePlaySound(sound)}
    >
      <View style={[styles.soundIcon, { backgroundColor: sound.color + '20' }]}>
        <Ionicons 
          name={playingSound === sound.id ? 'pause' : (sound.icon as any)} 
          size={32} 
          color={sound.color} 
        />
      </View>
      <Text style={styles.soundTitle}>{sound.title}</Text>
      {sound.audioSource?.attribution && (
        <Text style={styles.soundAttribution}>
          {sound.audioSource.attribution.split('|')[0].trim()}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sleep</Text>
          <Text style={styles.subtitle}>Rest well, live better</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
            onPress={() => setActiveTab('stories')}
          >
            <Text style={[styles.tabText, activeTab === 'stories' && styles.activeTabText]}>
              Sleep Stories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sounds' && styles.activeTab]}
            onPress={() => setActiveTab('sounds')}
          >
            <Text style={[styles.tabText, activeTab === 'sounds' && styles.activeTabText]}>
              Soundscapes
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'stories' ? (
          <>
            <TouchableOpacity style={styles.featuredCard}>
              <LinearGradient
                colors={['#1A365D', '#2C5282']}
                style={styles.featuredGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>TONIGHT'S STORY</Text>
                  </View>
                  <Text style={styles.featuredTitle}>The Lavender Fields</Text>
                  <Text style={styles.featuredNarrator}>Narrated by Tamara Levitt</Text>
                  <Text style={styles.featuredDescription}>
                    Journey through the peaceful lavender fields of Provence
                  </Text>
                  <View style={styles.featuredFooter}>
                    <View style={styles.featuredMeta}>
                      <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.featuredDuration}>32 min</Text>
                    </View>
                    <View style={styles.featuredPlay}>
                      <Ionicons name="play-circle" size={48} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Sleep Stories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sleepStories.map(renderSleepStory)}
              </ScrollView>
            </View>
          </>
        ) : (
          <View style={styles.soundsGrid}>
            {soundscapes.map(renderSoundscape)}
          </View>
        )}

        <View style={styles.sleepToolsSection}>
          <Text style={styles.sectionTitle}>Sleep Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard}>
              <LinearGradient
                colors={['#4C51BF', '#667EEA']}
                style={styles.toolGradient}
              >
                <Ionicons name="bed-outline" size={32} color="#FFFFFF" />
                <Text style={styles.toolTitle}>Sleep Timer</Text>
                <Text style={styles.toolDescription}>Auto-stop playback</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => setShowBreathing(true)}
            >
              <LinearGradient
                colors={['#805AD5', '#9F7AEA']}
                style={styles.toolGradient}
              >
                <Ionicons name="sync-outline" size={32} color="#FFFFFF" />
                <Text style={styles.toolTitle}>Breathing</Text>
                <Text style={styles.toolDescription}>4-7-8 technique</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SleepPlayer
        visible={showSleepPlayer}
        track={currentTrack}
        onClose={() => {
          setShowSleepPlayer(false);
          setPlayingSound(null);
          audioService.stop();
        }}
      />

      <BreathingExercise
        visible={showBreathing}
        onClose={() => setShowBreathing(false)}
      />
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6B4EFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  featuredGradient: {
    borderRadius: 20,
    padding: 20,
  },
  featuredContent: {
    height: 200,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredNarrator: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  featuredDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredDuration: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  featuredPlay: {},
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  storyCard: {
    marginLeft: 20,
    marginRight: 5,
  },
  storyImage: {
    width: width * 0.6,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  storyGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  proBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  proText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  storyInfo: {},
  storyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  storyNarrator: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyDuration: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 30,
  },
  soundCard: {
    width: (width - 50) / 2,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  soundIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  soundTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  soundCardActive: {
    borderWidth: 2,
    borderColor: '#6B4EFF',
  },
  soundAttribution: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  sleepToolsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  toolCard: {
    flex: 1,
  },
  toolGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  toolDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
  },
});