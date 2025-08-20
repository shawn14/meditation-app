export interface AudioSource {
  id: string;
  title: string;
  artist: string;
  uri: string;
  duration: number; // in seconds
  category: 'nature' | 'binaural' | 'meditation' | 'ambient' | 'white_noise';
  license: 'CC0' | 'CC-BY' | 'CC-BY-SA' | 'CC-BY-NC' | 'public_domain';
  attribution?: string;
  thumbnailUrl?: string;
  isLocal?: boolean; // true if bundled with app
  fileSize?: number; // in bytes
  tags?: string[];
}

export interface AudioManifest {
  version: string;
  lastUpdated: string;
  sources: AudioSource[];
}

export interface CachedAudio {
  sourceId: string;
  localPath: string;
  downloadedAt: string;
  fileSize: number;
}

export interface AudioCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}