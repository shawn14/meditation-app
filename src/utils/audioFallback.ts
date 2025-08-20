// Audio fallback system for handling failed audio loads
// Provides alternative URLs when primary sources fail

export const audioFallbacks: Record<string, string[]> = {
  // Rain sounds fallbacks
  'rain-1': [
    'https://cdn.freesound.org/previews/531/531947_10565178-lq.mp3',
    'https://opengameart.org/sites/default/files/audio_preview/rain-01.mp3',
    'https://freepd.com/music/Rain.mp3'
  ],
  
  // Ocean sounds fallbacks
  'ocean-waves-1': [
    'https://cdn.freesound.org/previews/461/461384_8995557-lq.mp3',
    'https://opengameart.org/sites/default/files/audio_preview/ocean-waves.mp3',
    'https://freepd.com/music/Ocean%20Waves.mp3'
  ],
  
  // Meditation music fallbacks
  'ambient-1': [
    'https://freepd.com/music/Meditation%20Impromptu%2001.mp3',
    'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3',
    'https://freepd.com/music/Ethereal%20Relaxation.mp3'
  ],
  
  // White noise fallbacks
  'white-noise-1': [
    'https://cdn.freesound.org/previews/387/387876_7413172-lq.mp3',
    'https://opengameart.org/sites/default/files/audio_preview/white-noise.mp3',
    'https://freepd.com/music/White%20Noise.mp3'
  ]
};

/**
 * Get fallback URLs for a given audio ID
 * @param audioId The ID of the audio track
 * @returns Array of fallback URLs or empty array if no fallbacks exist
 */
export const getFallbackUrls = (audioId: string): string[] => {
  return audioFallbacks[audioId] || [];
};

/**
 * Try loading audio from multiple URLs until one succeeds
 * @param urls Array of URLs to try in order
 * @param onSuccess Callback when a URL successfully loads
 * @param onError Callback when all URLs fail
 */
export const tryAudioUrls = async (
  urls: string[],
  onSuccess: (url: string) => void,
  onError: (error: Error) => void
) => {
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        onSuccess(url);
        return;
      }
    } catch (error) {
      console.log(`Failed to load ${url}:`, error);
    }
  }
  
  onError(new Error('All audio URLs failed to load'));
};