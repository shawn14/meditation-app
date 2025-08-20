import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioSource, CachedAudio } from '../types/audio';

const AUDIO_CACHE_DIR = `${FileSystem.documentDirectory}audioCache/`;
const CACHE_METADATA_KEY = 'audio_cache_metadata';
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB

class AudioCacheService {
  private cacheMetadata: CachedAudio[] = [];

  constructor() {
    this.initializeCache();
  }

  private async initializeCache() {
    try {
      // Ensure cache directory exists
      const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
      }

      // Load cache metadata
      const metadataStr = await AsyncStorage.getItem(CACHE_METADATA_KEY);
      if (metadataStr) {
        this.cacheMetadata = JSON.parse(metadataStr);
        await this.cleanupOrphanedFiles();
      }
    } catch (error) {
      console.error('Error initializing audio cache:', error);
    }
  }

  private async cleanupOrphanedFiles() {
    try {
      const files = await FileSystem.readDirectoryAsync(AUDIO_CACHE_DIR);
      const cachedFileNames = this.cacheMetadata.map(item => 
        item.localPath.split('/').pop()
      );

      // Remove files not in metadata
      for (const file of files) {
        if (!cachedFileNames.includes(file)) {
          await FileSystem.deleteAsync(`${AUDIO_CACHE_DIR}${file}`, { idempotent: true });
        }
      }
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
    }
  }

  async getCachedAudio(sourceId: string): Promise<string | null> {
    const cached = this.cacheMetadata.find(item => item.sourceId === sourceId);
    if (!cached) return null;

    // Verify file still exists
    const fileInfo = await FileSystem.getInfoAsync(cached.localPath);
    if (!fileInfo.exists) {
      // Remove from metadata if file doesn't exist
      await this.removeCacheEntry(sourceId);
      return null;
    }

    return cached.localPath;
  }

  async cacheAudio(source: AudioSource, progressCallback?: (progress: number) => void): Promise<string> {
    try {
      // Check if already cached
      const existing = await this.getCachedAudio(source.id);
      if (existing) return existing;

      // Check cache size before downloading
      const currentSize = await this.getCacheSize();
      if (currentSize >= MAX_CACHE_SIZE) {
        await this.evictOldestCache();
      }

      // Generate local file path
      const fileExtension = source.uri.split('.').pop() || 'mp3';
      const localPath = `${AUDIO_CACHE_DIR}${source.id}.${fileExtension}`;

      // Download with progress
      const downloadResumable = FileSystem.createDownloadResumable(
        source.uri,
        localPath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          progressCallback?.(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (!result) throw new Error('Download failed');

      // Get file size
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      const fileSize = fileInfo.size || 0;

      // Add to cache metadata
      const cacheEntry: CachedAudio = {
        sourceId: source.id,
        localPath,
        downloadedAt: new Date().toISOString(),
        fileSize,
      };

      this.cacheMetadata.push(cacheEntry);
      await this.saveCacheMetadata();

      return localPath;
    } catch (error) {
      console.error('Error caching audio:', error);
      throw error;
    }
  }

  async removeCacheEntry(sourceId: string) {
    const cached = this.cacheMetadata.find(item => item.sourceId === sourceId);
    if (!cached) return;

    try {
      // Delete file
      await FileSystem.deleteAsync(cached.localPath, { idempotent: true });

      // Remove from metadata
      this.cacheMetadata = this.cacheMetadata.filter(item => item.sourceId !== sourceId);
      await this.saveCacheMetadata();
    } catch (error) {
      console.error('Error removing cache entry:', error);
    }
  }

  async clearCache() {
    try {
      // Delete all cached files
      await FileSystem.deleteAsync(AUDIO_CACHE_DIR, { idempotent: true });
      
      // Recreate directory
      await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });

      // Clear metadata
      this.cacheMetadata = [];
      await this.saveCacheMetadata();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  private async getCacheSize(): Promise<number> {
    return this.cacheMetadata.reduce((total, item) => total + item.fileSize, 0);
  }

  private async evictOldestCache() {
    if (this.cacheMetadata.length === 0) return;

    // Sort by download date and remove oldest
    this.cacheMetadata.sort((a, b) => 
      new Date(a.downloadedAt).getTime() - new Date(b.downloadedAt).getTime()
    );

    const oldest = this.cacheMetadata[0];
    await this.removeCacheEntry(oldest.sourceId);
  }

  private async saveCacheMetadata() {
    try {
      await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(this.cacheMetadata));
    } catch (error) {
      console.error('Error saving cache metadata:', error);
    }
  }

  async getCacheInfo() {
    const size = await this.getCacheSize();
    return {
      totalSize: size,
      maxSize: MAX_CACHE_SIZE,
      usagePercentage: (size / MAX_CACHE_SIZE) * 100,
      cachedCount: this.cacheMetadata.length,
      items: this.cacheMetadata,
    };
  }

  async preloadFeaturedAudio(sources: AudioSource[]) {
    const promises = sources.map(source => 
      this.cacheAudio(source).catch(error => {
        console.error(`Failed to preload ${source.id}:`, error);
      })
    );

    await Promise.all(promises);
  }
}

export default new AudioCacheService();