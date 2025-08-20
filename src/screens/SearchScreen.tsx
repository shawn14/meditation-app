import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { openSourceAudioLibrary, audioCategories } from '../data/openSourceAudio';
import { triggerHaptic } from '../utils/haptics';

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter results based on search query and category
  const filteredResults = openSourceAudioLibrary.filter((audio) => {
    const matchesSearch = 
      audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audio.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (audio.tags && audio.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || audio.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const recentSearches = [
    'Sleep sounds',
    'Morning meditation',
    'Focus music',
    'Anxiety relief',
    'Deep breathing',
  ];

  const renderResult = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => {
        triggerHaptic('light');
        navigation.navigate('Meditate', {
          screen: 'MeditationDetail',
          params: {
            meditation: {
              id: item.id,
              title: item.title,
              duration: Math.floor(item.duration / 60).toString(),
              instructor: item.artist,
              description: `Experience ${item.title}. ${item.attribution || ''}`,
              benefits: item.tags || [],
              audioUrl: item.uri,
              isPro: false
            }
          }
        });
      }}
    >
      <View style={styles.resultIcon}>
        <Ionicons 
          name={getCategoryIcon(item.category)} 
          size={24} 
          color="#6B4EFF" 
        />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSubtitle}>{item.artist} • {Math.floor(item.duration / 60)} min</Text>
        {item.tags && (
          <View style={styles.tagContainer}>
            {item.tags.slice(0, 3).map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const getCategoryIcon = (category: string): any => {
    switch (category) {
      case 'nature': return 'leaf';
      case 'meditation': return 'flower';
      case 'ambient': return 'musical-notes';
      case 'binaural': return 'headset';
      case 'white_noise': return 'radio';
      default: return 'play-circle';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search meditations, sleep stories..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.categoryChipText, selectedCategory === 'all' && styles.categoryChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {audioCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, selectedCategory === category.id && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[styles.categoryChipText, selectedCategory === category.id && styles.categoryChipTextActive]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {searchQuery.length === 0 ? (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => setSearchQuery(search)}
              >
                <Ionicons name="time-outline" size={20} color="#8E8E93" />
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <Text style={styles.resultCount}>{filteredResults.length} results</Text>
            <FlatList
              data={filteredResults}
              renderItem={renderResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={48} color="#8E8E93" />
                  <Text style={styles.emptyText}>No results found</Text>
                  <Text style={styles.emptySubtext}>Try different keywords or categories</Text>
                </View>
              }
            />
          </View>
        )}
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
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#6B4EFF',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  recentSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  recentText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  resultCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
});