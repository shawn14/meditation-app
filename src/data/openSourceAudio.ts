import { AudioSource } from '../types/audio';

// Open source audio from various CC-licensed and public domain sources
// Attribution is included for each source as required by their licenses

export const openSourceAudioLibrary: AudioSource[] = [
  // Nature Sounds - Public Domain / CC0
  {
    id: 'rain-1',
    title: 'Gentle Rain',
    artist: 'Nature Sounds',
    uri: 'https://freesound.org/data/previews/531/531947_11715237-lq.mp3',
    duration: 600,
    category: 'nature',
    license: 'CC0',
    attribution: 'Rain sound by inchadney | freesound.org',
    tags: ['rain', 'calm', 'sleep', 'relaxation']
  },
  {
    id: 'ocean-waves-1',
    title: 'Ocean Waves',
    artist: 'Nature Recordings',
    uri: 'https://freesound.org/data/previews/450/450256_5829911-lq.mp3',
    duration: 480,
    category: 'nature',
    license: 'CC0',
    attribution: 'Ocean waves by Luftrum | freesound.org',
    tags: ['ocean', 'waves', 'beach', 'sleep']
  },
  {
    id: 'forest-ambience-1',
    title: 'Forest Ambience',
    artist: 'Field Recordings',
    uri: 'https://freesound.org/data/previews/401/401272_5123451-lq.mp3',
    duration: 720,
    category: 'nature',
    license: 'CC-BY',
    attribution: 'Forest ambience by klankbeeld | freesound.org | CC BY 3.0',
    tags: ['forest', 'birds', 'nature', 'morning']
  },

  // Tibetan Bowls & Meditation Bells
  {
    id: 'tibetan-bowl-1',
    title: 'Tibetan Singing Bowl',
    artist: 'Meditation Sounds',
    uri: 'https://freesound.org/data/previews/411/411089_5121236-lq.mp3',
    duration: 180,
    category: 'meditation',
    license: 'CC0',
    attribution: 'Tibetan bowl by JohnsonBrandEditing | freesound.org',
    tags: ['tibetan', 'bowl', 'meditation', 'mindfulness']
  },
  {
    id: 'meditation-bell-1',
    title: 'Meditation Bell',
    artist: 'Mindfulness Tools',
    uri: 'https://freesound.org/data/previews/415/415432_5789639-lq.mp3',
    duration: 60,
    category: 'meditation',
    license: 'CC0',
    attribution: 'Bell sound by plasterbrain | freesound.org',
    tags: ['bell', 'chime', 'meditation', 'timer']
  },

  // Ambient Music - CC Licensed
  {
    id: 'ambient-1',
    title: 'Cosmic Dreams',
    artist: 'Ambient Collection',
    uri: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_08_-_Snowfall.mp3',
    duration: 420,
    category: 'ambient',
    license: 'CC-BY',
    attribution: 'Snowfall by Kai Engel | freemusicarchive.org | CC BY 4.0',
    tags: ['ambient', 'calm', 'space', 'relaxation']
  },
  {
    id: 'ambient-2',
    title: 'Ethereal Journey',
    artist: 'Ambient Soundscapes',
    uri: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Jahzzar/Tumbling_Dishes_Like_Old-Mans_Wishes/Jahzzar_-_05_-_Siesta.mp3',
    duration: 360,
    category: 'ambient',
    license: 'CC-BY-SA',
    attribution: 'Siesta by Jahzzar | freemusicarchive.org | CC BY-SA 4.0',
    tags: ['ambient', 'peaceful', 'meditation', 'sleep']
  },

  // Binaural Beats - Generated/Public Domain
  {
    id: 'binaural-theta-1',
    title: 'Theta Waves (6Hz)',
    artist: 'Binaural Generator',
    uri: 'https://mynoise.net/Data/BINAURAL/fb_b3.ogg',
    duration: 900,
    category: 'binaural',
    license: 'CC-BY',
    attribution: 'Binaural beats by myNoise.net | CC BY 4.0',
    tags: ['binaural', 'theta', 'meditation', 'deep-relaxation']
  },
  {
    id: 'binaural-delta-1',
    title: 'Delta Waves (3Hz)',
    artist: 'Sleep Frequencies',
    uri: 'https://mynoise.net/Data/BINAURAL/fb_b1.ogg',
    duration: 900,
    category: 'binaural',
    license: 'CC-BY',
    attribution: 'Delta waves by myNoise.net | CC BY 4.0',
    tags: ['binaural', 'delta', 'sleep', 'deep-sleep']
  },

  // White Noise
  {
    id: 'white-noise-1',
    title: 'Pure White Noise',
    artist: 'Noise Generator',
    uri: 'https://mynoise.net/Data/WHITE/fb_w1.ogg',
    duration: 600,
    category: 'white_noise',
    license: 'CC-BY',
    attribution: 'White noise by myNoise.net | CC BY 4.0',
    tags: ['white-noise', 'sleep', 'focus', 'concentration']
  },
  {
    id: 'pink-noise-1',
    title: 'Soft Pink Noise',
    artist: 'Noise Generator',
    uri: 'https://mynoise.net/Data/PINK/fb_p1.ogg',
    duration: 600,
    category: 'white_noise',
    license: 'CC-BY',
    attribution: 'Pink noise by myNoise.net | CC BY 4.0',
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