import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { triggerHaptic } from '../utils/haptics';
import { saveMoodEntry } from '../utils/storage';

const moods = [
  { id: 'amazing', label: 'Amazing', icon: 'happy-outline', color: '#48BB78' },
  { id: 'good', label: 'Good', icon: 'happy-outline', color: '#4299E1' },
  { id: 'okay', label: 'Okay', icon: 'remove-circle-outline', color: '#ED8936' },
  { id: 'stressed', label: 'Stressed', icon: 'sad-outline', color: '#F56565' },
  { id: 'anxious', label: 'Anxious', icon: 'alert-circle-outline', color: '#9F7AEA' },
];

const feelings = [
  'Grateful', 'Peaceful', 'Energized', 'Focused', 'Relaxed',
  'Tired', 'Overwhelmed', 'Motivated', 'Content', 'Restless'
];

export default function CheckInScreen({ navigation }: any) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleMoodSelect = (moodId: string) => {
    triggerHaptic('light');
    setSelectedMood(moodId);
  };

  const toggleFeeling = (feeling: string) => {
    triggerHaptic('light');
    setSelectedFeelings(prev => 
      prev.includes(feeling) 
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleSaveCheckIn = async () => {
    if (!selectedMood) return;
    
    triggerHaptic('success');
    
    await saveMoodEntry({
      mood: selectedMood,
      feelings: selectedFeelings,
      notes,
      timestamp: new Date().toISOString()
    });

    // Navigate to recommended content based on mood
    if (selectedMood === 'stressed' || selectedMood === 'anxious') {
      navigation.navigate('Meditate', {
        screen: 'MeditationDetail',
        params: {
          category: 'anxiety',
          title: 'Anxiety Relief',
          duration: '15 min'
        }
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daily Check-In</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.question}>How are you feeling today?</Text>
          
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodButton,
                  selectedMood === mood.id && styles.moodButtonSelected
                ]}
                onPress={() => handleMoodSelect(mood.id)}
              >
                <Ionicons 
                  name={mood.icon as any} 
                  size={40} 
                  color={selectedMood === mood.id ? mood.color : '#8E8E93'} 
                />
                <Text style={[
                  styles.moodLabel,
                  selectedMood === mood.id && { color: mood.color }
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>What else are you feeling?</Text>
          
          <View style={styles.feelingsContainer}>
            {feelings.map((feeling) => (
              <TouchableOpacity
                key={feeling}
                style={[
                  styles.feelingChip,
                  selectedFeelings.includes(feeling) && styles.feelingChipSelected
                ]}
                onPress={() => toggleFeeling(feeling)}
              >
                <Text style={[
                  styles.feelingText,
                  selectedFeelings.includes(feeling) && styles.feelingTextSelected
                ]}>
                  {feeling}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !selectedMood && styles.saveButtonDisabled]}
            onPress={handleSaveCheckIn}
            disabled={!selectedMood}
          >
            <LinearGradient
              colors={selectedMood ? ['#6B4EFF', '#9B59B6'] : ['#3A3A3C', '#3A3A3C']}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveButtonText}>Save Check-In</Text>
            </LinearGradient>
          </TouchableOpacity>

          {(selectedMood === 'stressed' || selectedMood === 'anxious') && (
            <View style={styles.recommendationBox}>
              <Ionicons name="bulb-outline" size={20} color="#6B4EFF" />
              <Text style={styles.recommendationText}>
                We'll recommend some calming exercises after you save
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  moodButton: {
    alignItems: 'center',
    padding: 10,
  },
  moodButtonSelected: {
    transform: [{ scale: 1.1 }],
  },
  moodLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  feelingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 40,
  },
  feelingChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  feelingChipSelected: {
    borderColor: '#6B4EFF',
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
  },
  feelingText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  feelingTextSelected: {
    color: '#6B4EFF',
  },
  saveButton: {
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});