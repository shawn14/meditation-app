import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [greeting, setGreeting] = useState('');
  const [streak, setStreak] = useState(7);
  const [totalMinutes, setTotalMinutes] = useState(342);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const dailyRecommendations = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      duration: '10 min',
      type: 'Meditation',
      gradient: ['#6B4EFF', '#9B59B6'],
      icon: 'sunny-outline',
    },
    {
      id: '2',
      title: 'Deep Sleep Stories',
      duration: '30 min',
      type: 'Sleep',
      gradient: ['#2E3192', '#1BFFFF'],
      icon: 'moon-outline',
    },
    {
      id: '3',
      title: 'Anxiety Relief',
      duration: '15 min',
      type: 'SOS',
      gradient: ['#FF6B6B', '#FF8E53'],
      icon: 'heart-outline',
    },
  ];

  const quickActions = [
    { id: '1', title: 'Breathe', icon: 'sync-outline', duration: '3 min' },
    { id: '2', title: 'Focus', icon: 'eye-outline', duration: '5 min' },
    { id: '3', title: 'Relax', icon: 'water-outline', duration: '10 min' },
    { id: '4', title: 'Walk', icon: 'walk-outline', duration: '15 min' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.userName}>Welcome back</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={24} color="#FF6B6B" />
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="time-outline" size={24} color="#6B4EFF" />
          <Text style={styles.statNumber}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>Total Minutes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Recommendations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dailyRecommendations.map((item) => (
            <TouchableOpacity key={item.id} style={styles.recommendationCard}>
              <LinearGradient
                colors={item.gradient}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={item.icon as any} size={32} color="white" />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDuration}>{item.duration}</Text>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Sessions</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickCard}>
              <Ionicons name={action.icon as any} size={28} color="#6B4EFF" />
              <Text style={styles.quickTitle}>{action.title}</Text>
              <Text style={styles.quickDuration}>{action.duration}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.dailyCheckIn}>
        <LinearGradient
          colors={['#6B4EFF', '#9B59B6']}
          style={styles.checkInGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.checkInContent}>
            <Ionicons name="calendar-outline" size={24} color="white" />
            <View style={styles.checkInText}>
              <Text style={styles.checkInTitle}>Daily Check-In</Text>
              <Text style={styles.checkInSubtitle}>How are you feeling today?</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
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
  recommendationCard: {
    marginLeft: 20,
    marginRight: 5,
  },
  cardGradient: {
    width: width * 0.7,
    height: 180,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  cardDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
  },
  quickCard: {
    width: (width - 50) / 2,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  quickDuration: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
  dailyCheckIn: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  checkInGradient: {
    borderRadius: 20,
    padding: 20,
  },
  checkInContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkInText: {
    flex: 1,
    marginLeft: 15,
  },
  checkInTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkInSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});