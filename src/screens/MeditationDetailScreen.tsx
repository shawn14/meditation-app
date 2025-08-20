import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MeditationPlayer from '../components/MeditationPlayer';
import { AudioTrack } from '../services/audioService';
import { haptics } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface Meditation {
  id: string;
  title: string;
  duration: string;
  instructor: string;
  description: string;
  benefits: string[];
  audioUrl: string;
  isPro: boolean;
}

export default function MeditationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { meditation } = route.params as { meditation: Meditation };
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handlePlay = async () => {
    await haptics.meditationStart();
    const track: AudioTrack = {
      id: meditation.id,
      title: meditation.title,
      uri: meditation.audioUrl,
      duration: parseInt(meditation.duration) * 60,
    };
    setShowPlayer(true);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6B4EFF', '#9B59B6']}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="headset" size={64} color="rgba(255,255,255,0.9)" />
            </View>
            <Text style={styles.title}>{meditation.title}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>{meditation.instructor}</Text>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.metaText}>{meditation.duration}</Text>
              {meditation.isPro && (
                <>
                  <Text style={styles.metaDivider}>•</Text>
                  <View style={styles.proBadge}>
                    <Text style={styles.proText}>PRO</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this session</Text>
            <Text style={styles.description}>{meditation.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {meditation.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#6B4EFF" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color="#6B4EFF" />
              <Text style={styles.statNumber}>12.5k</Text>
              <Text style={styles.statLabel}>Listened</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
              <Text style={styles.statNumber}>8.2k</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>

          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>Similar Sessions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { id: '1', title: 'Calm Mind', duration: '10 min', colors: ['#4ECDC4', '#44A08D'], icon: 'leaf' },
                { id: '2', title: 'Focus Flow', duration: '15 min', colors: ['#667eea', '#764ba2'], icon: 'eye' },
                { id: '3', title: 'Deep Rest', duration: '20 min', colors: ['#FF6B6B', '#FF8E53'], icon: 'moon' }
              ].map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.relatedCard}
                  onPress={() => {
                    haptics.light();
                    // Navigate to the same screen with new meditation data
                    navigation.push('MeditationDetail', {
                      meditation: {
                        id: `related-${item.id}`,
                        title: item.title,
                        duration: item.duration.replace(' min', ''),
                        instructor: meditation.instructor,
                        description: `Experience the calming effects of ${item.title.toLowerCase()}.`,
                        benefits: ['Reduces stress', 'Improves focus', 'Better sleep'],
                        audioUrl: meditation.audioUrl, // Using same audio for demo
                        isPro: false
                      }
                    });
                  }}
                >
                  <LinearGradient
                    colors={item.colors}
                    style={styles.relatedGradient}
                  >
                    <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
                    <Text style={styles.relatedTitle}>{item.title}</Text>
                    <Text style={styles.relatedDuration}>{item.duration}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => {
            haptics.light();
            setIsDownloaded(!isDownloaded);
            if (!isDownloaded) {
              alert('Session downloaded for offline use');
            }
          }}
        >
          <Ionicons 
            name={isDownloaded ? "download" : "download-outline"} 
            size={24} 
            color="#6B4EFF" 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <LinearGradient
            colors={['#6B4EFF', '#9B59B6']}
            style={styles.playGradient}
          >
            <Ionicons name="play" size={24} color="#FFFFFF" style={{ marginLeft: 2 }} />
            <Text style={styles.playText}>Play Session</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => {
            haptics.light();
            setIsFavorite(!isFavorite);
            if (!isFavorite) {
              alert('Added to favorites');
            }
          }}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#FF6B6B" : "#6B4EFF"} 
          />
        </TouchableOpacity>
      </View>

      <MeditationPlayer
        visible={showPlayer}
        track={
          showPlayer
            ? {
                id: meditation.id,
                title: meditation.title,
                uri: meditation.audioUrl,
                duration: parseInt(meditation.duration) * 60,
              }
            : null
        }
        onClose={() => setShowPlayer(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  metaDivider: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginHorizontal: 8,
  },
  proBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#8E8E93',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 12,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  relatedSection: {
    marginBottom: 100,
  },
  relatedCard: {
    marginRight: 12,
  },
  relatedGradient: {
    width: 120,
    height: 120,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  relatedDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#0A0A0C',
    borderTopWidth: 1,
    borderTopColor: '#1C1C1E',
  },
  playButton: {
    flex: 1,
    marginHorizontal: 15,
  },
  playGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
  },
  playText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  downloadButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});