import { AudioSource } from '../types/audio';

// Open source audio from various CC-licensed and public domain sources
// These URLs point to freely available meditation and nature sounds
// All audio is either CC0, Creative Commons, or Public Domain licensed
//
// Note: Some URLs may require CORS headers or may not work in all environments.
// Alternative sources for free meditation audio:
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
    uri: 'https://cdn.freesound.org/previews/531/531947_10565178-lq.mp3', // Gentle rain ambience
    duration: 600,
    category: 'nature',
    license: 'CC0',
    attribution: 'Rain ambience | Freesound.org | CC0',
    tags: ['rain', 'calm', 'sleep', 'relaxation']
  },
  {
    id: 'ocean-waves-1',
    title: 'Ocean Waves',
    artist: 'Nature Recordings',
    uri: 'https://cdn.freesound.org/previews/461/461384_8995557-lq.mp3', // Ocean waves on shore
    duration: 480,
    category: 'nature',
    license: 'CC0',
    attribution: 'Ocean waves | Freesound.org | CC0',
    tags: ['ocean', 'waves', 'beach', 'sleep']
  },
  {
    id: 'forest-ambience-1',
    title: 'Forest Ambience',
    artist: 'Field Recordings',
    uri: 'https://cdn.freesound.org/previews/567/567901_11525614-lq.mp3', // Forest birds ambience
    duration: 720,
    category: 'nature',
    license: 'CC-BY',
    attribution: 'Forest birds | Freesound.org | CC BY 3.0',
    tags: ['forest', 'birds', 'nature', 'morning']
  },

  // Tibetan Bowls & Meditation Bells
  {
    id: 'tibetan-bowl-1',
    title: 'Tibetan Singing Bowl',
    artist: 'Meditation Sounds',
    uri: 'https://cdn.freesound.org/previews/368/368739_6893686-lq.mp3', // Tibetan singing bowl
    duration: 180,
    category: 'meditation',
    license: 'CC0',
    attribution: 'Singing bowl | Freesound.org | CC0',
    tags: ['tibetan', 'bowl', 'meditation', 'mindfulness']
  },
  {
    id: 'meditation-bell-1',
    title: 'Meditation Bell',
    artist: 'Mindfulness Tools',
    uri: 'https://cdn.freesound.org/previews/411/411089_1987725-lq.mp3', // Meditation bell chime
    duration: 60,
    category: 'meditation',
    license: 'CC0',
    attribution: 'Meditation bell | Freesound.org | CC0',
    tags: ['bell', 'chime', 'meditation', 'timer']
  },

  // Ambient Music - CC Licensed
  {
    id: 'ambient-1',
    title: 'Cosmic Dreams',
    artist: 'Ambient Collection',
    uri: 'https://freepd.com/music/Meditation%20Impromptu%2001.mp3', // Ambient meditation music
    duration: 420,
    category: 'ambient',
    license: 'CC0',
    attribution: 'Meditation Impromptu | FreePD.com | CC0',
    tags: ['ambient', 'calm', 'space', 'relaxation']
  },
  {
    id: 'ambient-2',
    title: 'Ethereal Journey',
    artist: 'Ambient Soundscapes',
    uri: 'https://freepd.com/music/Meditation%20Impromptu%2002.mp3', // Ethereal ambient soundscape
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
    uri: 'https://cdn.freesound.org/previews/437/437969_8415217-lq.mp3', // Deep meditation tone
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
    uri: 'https://cdn.freesound.org/previews/268/268812_4940665-lq.mp3', // Relaxation frequency
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
    uri: 'https://cdn.freesound.org/previews/387/387876_7413172-lq.mp3', // White noise for focus
    duration: 600,
    category: 'white_noise',
    license: 'CC0',
    attribution: 'White noise | Freesound.org | CC0',
    tags: ['white-noise', 'sleep', 'focus', 'concentration']
  },
  {
    id: 'pink-noise-1',
    title: 'Soft Pink Noise',
    artist: 'Noise Generator',
    uri: 'https://cdn.freesound.org/previews/387/387877_7413172-lq.mp3', // Pink noise for sleep
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