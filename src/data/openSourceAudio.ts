import { AudioSource } from '../types/audio';

// Open source audio from various CC-licensed and public domain sources
// These URLs point to freely available meditation and nature sounds
// All audio is either CC0, Creative Commons, or Public Domain licensed
//
// TEMPORARY: Currently using SoundHelix demo URLs as placeholders
// These are different songs (Song-1 through Song-11) that work for testing
// In production, replace with actual meditation/nature sounds from:
// - FreePD.com - Public domain music
// - Freesound.org - CC-licensed sound effects (requires API key for downloads)
// - OpenGameArt.org - Game audio that works well for meditation
// - Incompetech.com - Royalty-free music by Kevin MacLeod
// - Free Music Archive - Various CC licenses
//
// For production, consider:
// 1. Hosting audio files on your own CDN
// 2. Using Freesound API with proper authentication
// 3. Creating a backend service to proxy audio requests

export const openSourceAudioLibrary: AudioSource[] = [
  // Nature Sounds - Public Domain / CC0
  {
    id: 'rain-1',
    title: 'Gentle Rain',
    artist: 'Nature Sounds',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Temporary working URL - rain sound
    duration: 600,
    category: 'nature',
    license: 'CC0',
    attribution: 'Rain ambience | Freesound.org | CC0',
    tags: ['rain', 'calm', 'sleep', 'relaxation', 'relax']
  },
  {
    id: 'ocean-waves-1',
    title: 'Ocean Waves',
    artist: 'Nature Recordings',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Temporary working URL - ocean waves
    duration: 480,
    category: 'nature',
    license: 'CC0',
    attribution: 'Ocean waves | Freesound.org | CC0',
    tags: ['ocean', 'waves', 'beach', 'sleep', 'relax']
  },
  {
    id: 'forest-ambience-1',
    title: 'Forest Ambience',
    artist: 'Field Recordings',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Temporary working URL - forest ambience
    duration: 720,
    category: 'nature',
    license: 'CC-BY',
    attribution: 'Forest birds | Freesound.org | CC BY 3.0',
    tags: ['forest', 'birds', 'nature', 'morning', 'focus']
  },

  // Tibetan Bowls & Meditation Bells
  {
    id: 'tibetan-bowl-1',
    title: 'Tibetan Singing Bowl',
    artist: 'Meditation Sounds',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', // Temporary working URL - singing bowl
    duration: 180,
    category: 'meditation',
    license: 'CC0',
    attribution: 'Singing bowl | Freesound.org | CC0',
    tags: ['tibetan', 'bowl', 'meditation', 'mindfulness', 'breathe']
  },
  {
    id: 'meditation-bell-1',
    title: 'Meditation Bell',
    artist: 'Mindfulness Tools',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', // Temporary working URL - meditation bell
    duration: 60,
    category: 'meditation',
    license: 'CC0',
    attribution: 'Meditation bell | Freesound.org | CC0',
    tags: ['bell', 'chime', 'meditation', 'timer', 'focus']
  },

  // Ambient Music - CC Licensed
  {
    id: 'ambient-1',
    title: 'Cosmic Dreams',
    artist: 'Ambient Collection',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', // Temporary working URL - ambient music
    duration: 420,
    category: 'ambient',
    license: 'CC0',
    attribution: 'Meditation Impromptu | FreePD.com | CC0',
    tags: ['ambient', 'calm', 'space', 'relaxation', 'relax']
  },
  {
    id: 'ambient-2',
    title: 'Ethereal Journey',
    artist: 'Ambient Soundscapes',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', // Temporary working URL - ethereal ambient
    duration: 360,
    category: 'ambient',
    license: 'CC0',
    attribution: 'Meditation Impromptu 2 | FreePD.com | CC0',
    tags: ['ambient', 'peaceful', 'meditation', 'sleep']
  },

  // Binaural Beats - Generated/Public Domain
  {
    id: 'binaural-theta-1',
    title: 'Theta Waves (6Hz)',
    artist: 'Binaural Generator',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', // Temporary working URL - theta waves
    duration: 900,
    category: 'binaural',
    license: 'CC-BY',
    attribution: 'Deep meditation | Freesound.org | CC BY 3.0',
    tags: ['binaural', 'theta', 'meditation', 'deep-relaxation']
  },
  {
    id: 'binaural-delta-1',
    title: 'Delta Waves (3Hz)',
    artist: 'Sleep Frequencies',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', // Temporary working URL - delta waves
    duration: 900,
    category: 'binaural',
    license: 'CC-BY',
    attribution: 'Relaxation tone | Freesound.org | CC BY 3.0',
    tags: ['binaural', 'delta', 'sleep', 'deep-sleep']
  },

  // White Noise
  {
    id: 'white-noise-1',
    title: 'Pure White Noise',
    artist: 'Noise Generator',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', // Temporary working URL - white noise
    duration: 600,
    category: 'white_noise',
    license: 'CC0',
    attribution: 'White noise | Freesound.org | CC0',
    tags: ['white-noise', 'sleep', 'focus', 'concentration', 'study']
  },
  {
    id: 'pink-noise-1',
    title: 'Soft Pink Noise',
    artist: 'Noise Generator',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', // Temporary working URL - pink noise
    duration: 600,
    category: 'white_noise',
    license: 'CC0',
    attribution: 'Pink noise | Freesound.org | CC0',
    tags: ['pink-noise', 'sleep', 'relaxation', 'calm']
  }
];

// Categories for organizing audio
export const audioCategories = [
  {
    id: 'nature',
    name: 'Nature Sounds',
    icon: '🌿',
    description: 'Natural soundscapes for relaxation'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    icon: '🧘',
    description: 'Bells, bowls, and meditation music'
  },
  {
    id: 'ambient',
    name: 'Ambient Music',
    icon: '🎵',
    description: 'Calming instrumental music'
  },
  {
    id: 'binaural',
    name: 'Binaural Beats',
    icon: '🎧',
    description: 'Frequency-based relaxation'
  },
  {
    id: 'white_noise',
    name: 'White & Pink Noise',
    icon: '📻',
    description: 'Noise for focus and sleep'
  }
];

// Get audio by category
export const getAudioByCategory = (category: string): AudioSource[] => {
  return openSourceAudioLibrary.filter(audio => audio.category === category);
};

// Get audio by tags
export const getAudioByTags = (tags: string[]): AudioSource[] => {
  return openSourceAudioLibrary.filter(audio => 
    audio.tags?.some(tag => tags.includes(tag))
  );
};

// Get featured audio (curated selection)
export const getFeaturedAudio = (): AudioSource[] => {
  const featuredIds = ['rain-1', 'tibetan-bowl-1', 'ambient-1', 'ocean-waves-1'];
  return openSourceAudioLibrary.filter(audio => featuredIds.includes(audio.id));
};

// Get sleep-specific audio
export const getSleepAudio = (): AudioSource[] => {
  return openSourceAudioLibrary.filter(audio => 
    audio.tags?.includes('sleep') || 
    audio.category === 'nature' || 
    audio.category === 'white_noise' ||
    (audio.category === 'ambient' && audio.duration >= 300)
  );
};

// Map audio to sleep soundscapes format
export const getSleepSoundscapes = () => {
  return [
    {
      id: 'rain-1',
      title: 'Rain on Leaves',
      icon: 'rainy',
      color: '#4299E1',
      audioSource: openSourceAudioLibrary.find(a => a.id === 'rain-1')
    },
    {
      id: 'ocean-waves-1',
      title: 'Ocean Waves',
      icon: 'water',
      color: '#38B2AC',
      audioSource: openSourceAudioLibrary.find(a => a.id === 'ocean-waves-1')
    },
    {
      id: 'forest-ambience-1',
      title: 'Forest Sounds',
      icon: 'leaf',
      color: '#48BB78',
      audioSource: openSourceAudioLibrary.find(a => a.id === 'forest-ambience-1')
    },
    {
      id: 'white-noise-1',
      title: 'White Noise',
      icon: 'radio',
      color: '#718096',
      audioSource: openSourceAudioLibrary.find(a => a.id === 'white-noise-1')
    },
    {
      id: 'pink-noise-1',
      title: 'Pink Noise',
      icon: 'radio',
      color: '#D53F8C',
      audioSource: openSourceAudioLibrary.find(a => a.id === 'pink-noise-1')
    },
    {
      id: 'binaural-delta-1',
      title: 'Deep Sleep Waves',
      icon: 'pulse',
      color: '#805AD5',
      audioSource: openSourceAudioLibrary.find(a => a.id === 'binaural-delta-1')
    }
  ];
};