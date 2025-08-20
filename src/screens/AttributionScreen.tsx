import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { openSourceAudioLibrary } from '../data/openSourceAudio';

export default function AttributionScreen({ navigation }: any) {
  const licenseDescriptions: { [key: string]: string } = {
    'CC0': 'Public Domain - No rights reserved',
    'CC-BY': 'Attribution - Credit must be given to creator',
    'CC-BY-SA': 'Attribution-ShareAlike - Credit + same license',
    'CC-BY-NC': 'Attribution-NonCommercial - Credit + non-commercial use only',
    'public_domain': 'Public Domain - Free to use without restrictions'
  };

  const groupedByLicense = openSourceAudioLibrary.reduce((acc, audio) => {
    if (!acc[audio.license]) {
      acc[audio.license] = [];
    }
    acc[audio.license].push(audio);
    return acc;
  }, {} as { [key: string]: typeof openSourceAudioLibrary });

  const openLicenseInfo = (license: string) => {
    const urls: { [key: string]: string } = {
      'CC0': 'https://creativecommons.org/publicdomain/zero/1.0/',
      'CC-BY': 'https://creativecommons.org/licenses/by/4.0/',
      'CC-BY-SA': 'https://creativecommons.org/licenses/by-sa/4.0/',
      'CC-BY-NC': 'https://creativecommons.org/licenses/by-nc/4.0/',
    };
    
    if (urls[license]) {
      Linking.openURL(urls[license]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Audio Attributions</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.introText}>
            This app uses open source audio content under various Creative Commons licenses. 
            We are grateful to all the creators who have made their work available for everyone to enjoy.
          </Text>
        </View>

        {Object.entries(groupedByLicense).map(([license, audios]) => (
          <View key={license} style={styles.licenseSection}>
            <TouchableOpacity 
              style={styles.licenseHeader}
              onPress={() => openLicenseInfo(license)}
            >
              <View>
                <Text style={styles.licenseName}>{license}</Text>
                <Text style={styles.licenseDescription}>
                  {licenseDescriptions[license] || 'Custom License'}
                </Text>
              </View>
              <Ionicons name="open-outline" size={20} color="#6B4EFF" />
            </TouchableOpacity>

            {audios.map((audio) => (
              <View key={audio.id} style={styles.attributionCard}>
                <Text style={styles.audioTitle}>{audio.title}</Text>
                <Text style={styles.audioArtist}>by {audio.artist}</Text>
                {audio.attribution && (
                  <Text style={styles.attribution}>{audio.attribution}</Text>
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you to all the creators and platforms that make these sounds available:
          </Text>
          <View style={styles.sources}>
            <TouchableOpacity 
              style={styles.sourceLink}
              onPress={() => Linking.openURL('https://freesound.org')}
            >
              <Text style={styles.sourceName}>Freesound.org</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sourceLink}
              onPress={() => Linking.openURL('https://freemusicarchive.org')}
            >
              <Text style={styles.sourceName}>Free Music Archive</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sourceLink}
              onPress={() => Linking.openURL('https://mynoise.net')}
            >
              <Text style={styles.sourceName}>myNoise.net</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  intro: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#8E8E93',
  },
  licenseSection: {
    marginBottom: 30,
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  licenseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  licenseDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  attributionCard: {
    backgroundColor: '#0F0F11',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#6B4EFF',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  audioArtist: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  attribution: {
    fontSize: 12,
    color: '#6B4EFF',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1C1C1E',
  },
  footerText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
    textAlign: 'center',
  },
  sources: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  sourceLink: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  sourceName: {
    fontSize: 14,
    color: '#6B4EFF',
    fontWeight: '600',
  },
});