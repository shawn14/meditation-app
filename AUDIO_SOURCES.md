# Open Source Audio Integration

This document explains how open source audio has been integrated into the meditation app.

## Audio Sources

The app now uses free, open-source audio from the following sources:

1. **Freesound.org** - Community-driven sound library with CC-licensed content
2. **Free Music Archive** - Curated free music under various CC licenses
3. **myNoise.net** - Generated soundscapes and noise generators

## Audio Categories

- **Nature Sounds**: Rain, ocean waves, forest ambience
- **Meditation**: Tibetan bowls, meditation bells
- **Ambient Music**: Calming instrumental tracks
- **Binaural Beats**: Theta and delta frequencies for relaxation
- **White/Pink Noise**: For focus and sleep

## Implementation Details

### 1. Audio Library (`src/data/openSourceAudio.ts`)
Contains a curated collection of open source audio with proper attribution and licensing information.

### 2. Audio Caching (`src/services/audioCacheService.ts`)
- Automatically caches frequently used audio for offline playback
- Maximum cache size: 100MB
- Automatic cleanup of old cached files
- Background downloading while streaming

### 3. Attribution Screen (`src/screens/AttributionScreen.tsx`)
- Displays all audio attributions grouped by license type
- Links to license information
- Credits all creators and platforms

### 4. Integration Points
- MeditateScreen: Shows available meditation sessions with open source audio
- MeditationDetailScreen: Plays selected audio tracks
- AudioService: Handles playback with automatic caching

## Adding New Audio

To add new open source audio:

1. Find CC-licensed or public domain audio
2. Add to `openSourceAudioLibrary` array in `src/data/openSourceAudio.ts`
3. Include proper attribution information
4. Test playback and caching

## License Compliance

All audio used follows their respective licenses:
- CC0: No attribution required but provided anyway
- CC-BY: Attribution provided in app and source code
- CC-BY-SA: Attribution with same license terms
- Public Domain: Free to use without restrictions

## Note on URLs

The current implementation uses example URLs from the open source platforms. In production:
1. Host files on your own CDN for better performance
2. Or use direct links from the source platforms (check their terms)
3. Consider bundling essential tracks with the app