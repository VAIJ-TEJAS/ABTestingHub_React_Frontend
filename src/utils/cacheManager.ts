/**
 * Advanced cache management utility
 * Provides sophisticated caching mechanisms with TTL, invalidation, and persistence
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  persist?: boolean; // Persist to localStorage
  namespace?: string; // Cache namespace
  strategy?: 'lru' | 'fifo' | 'lfu'; // Eviction strategy
  serialize?: (value: any) => string; // Custom serialization
  deserialize?: (value: string) => any; // Custom deserialization
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  expiresAt?: number;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  totalSize: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };
  private options: Required<CacheOptions>;
  private accessOrder: string[] = []; // For LRU
  private accessFrequency: Map<string, number> = new Map(); // For LFU

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? Infinity,
      maxSize: options.maxSize ?? 1000,
      persist: options.persist ?? false,
      namespace: options.namespace ?? 'default',
      strategy: options.strategy ?? 'lru',
      serialize: options.serialize ?? JSON.stringify,
      deserialize: options.deserialize ?? JSON.parse,
    };

    if (this.options.persist) {
      this.loadFromStorage();
    }

    // Cleanup expired entries periodically
    this.startCleanupInterval();
  }

  /**
   * Sets a value in cache
   */
  set<T>(key: string, value: T, customTTL?: number): void {
    const ttl = customTTL ?? this.options.ttl;
    const expiresAt = ttl !== Infinity ? Date.now() + ttl : undefined;

    // Check if we need to evict
    if (this.cache.size >= this.options.maxSize && !this.cache.has(key)) {
      this.evict();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      accessCount: this.cache.get(key)?.accessCount ?? 0,
      lastAccessed: Date.now(),
      expiresAt,
    };

    this.cache.set(key, entry);
    this.updateAccessOrder(key);
    this.updateAccessFrequency(key);

    if (this.options.persist) {
      this.saveToStorage();
    }
  }

  /**
   * Gets a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.updateAccessOrder(key);
    this.updateAccessFrequency(key);

    this.stats.hits++;
    return entry.value as T;
  }

  /**
   * Gets value or computes and caches it
   */
  getOrSet<T>(key: string, factory: () => T | Promise<T>, customTTL?: number): T | Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = factory();
    
    if (result instanceof Promise) {
      return result.then((value) => {
        this.set(key, value, customTTL);
        return value;
      });
    } else {
      this.set(key, result, customTTL);
      return result;
    }
  }

  /**
   * Checks if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Deletes a key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.removeFromAccessOrder(key);
    this.accessFrequency.delete(key);

    if (this.options.persist) {
      this.saveToStorage();
    }

    return deleted;
  }

  /**
   * Clears all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.accessFrequency.clear();
    this.stats.evictions = 0;

    if (this.options.persist) {
      localStorage.removeItem(this.getStorageKey());
    }
  }

  /**
   * Gets cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? this.stats.hits / total : 0;

    let totalSize = 0;
    this.cache.forEach((entry) => {
      totalSize += this.estimateSize(entry.value);
    });

    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      evictions: this.stats.evictions,
      totalSize,
    };
  }

  /**
   * Gets all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Gets all cache values
   */
  values<T>(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.value as T);
  }

  /**
   * Gets all cache entries
   */
  entries<T>(): Array<[string, T]> {
    return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.value as T]);
  }

  /**
   * Invalidates entries matching a pattern
   */
  invalidate(pattern: string | RegExp): number {
    let count = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        this.delete(key);
        count++;
      }
    });

    return count;
  }

  /**
   * Invalidates entries by tags
   */
  invalidateByTag(tag: string): number {
    return this.invalidate(`^tag:${tag}:`);
  }

  /**
   * Sets value with tags
   */
  setWithTag<T>(key: string, value: T, tags: string[], customTTL?: number): void {
    // Store main entry
    this.set(key, value, customTTL);

    // Store tag references
    tags.forEach((tag) => {
      const tagKey = `tag:${tag}:${key}`;
      this.set(tagKey, true, customTTL);
    });
  }

  /**
   * Evicts entries based on strategy
   */
  private evict(): void {
    if (this.cache.size === 0) {
      return;
    }

    let keyToEvict: string | null = null;

    switch (this.options.strategy) {
      case 'lru':
        keyToEvict = this.accessOrder[0];
        break;
      case 'fifo':
        // Evict oldest by timestamp
        let oldestTime = Infinity;
        this.cache.forEach((entry, key) => {
          if (entry.timestamp < oldestTime) {
            oldestTime = entry.timestamp;
            keyToEvict = key;
          }
        });
        break;
      case 'lfu':
        // Evict least frequently used
        let minFreq = Infinity;
        this.accessFrequency.forEach((freq, key) => {
          if (freq < minFreq && this.cache.has(key)) {
            minFreq = freq;
            keyToEvict = key;
          }
        });
        break;
    }

    if (keyToEvict) {
      this.delete(keyToEvict);
      this.stats.evictions++;
    }
  }

  /**
   * Updates access order for LRU
   */
  private updateAccessOrder(key: string): void {
    if (this.options.strategy === 'lru') {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(key);
    }
  }

  /**
   * Removes from access order
   */
  private removeFromAccessOrder(key: string): void {
    if (this.options.strategy === 'lru') {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    }
  }

  /**
   * Updates access frequency for LFU
   */
  private updateAccessFrequency(key: string): void {
    if (this.options.strategy === 'lfu') {
      const current = this.accessFrequency.get(key) ?? 0;
      this.accessFrequency.set(key, current + 1);
    }
  }

  /**
   * Cleans up expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (entry.expiresAt && now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.delete(key));
  }

  /**
   * Starts periodic cleanup
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpired();
    }, 60000); // Cleanup every minute
  }

  /**
   * Saves cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        stats: this.stats,
        accessOrder: this.accessOrder,
        accessFrequency: Array.from(this.accessFrequency.entries()),
      };
      const serialized = this.options.serialize(data);
      localStorage.setItem(this.getStorageKey(), serialized);
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Loads cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const data = this.options.deserialize(stored);
        this.cache = new Map(data.entries);
        this.stats = data.stats ?? this.stats;
        this.accessOrder = data.accessOrder ?? [];
        this.accessFrequency = new Map(data.accessFrequency ?? []);
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Gets storage key
   */
  private getStorageKey(): string {
    return `cache:${this.options.namespace}`;
  }

  /**
   * Estimates size of value in bytes
   */
  private estimateSize(value: any): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      return 0;
    }
  }

  /**
   * Exports cache data
   */
  export(): string {
    const data = {
      entries: Array.from(this.cache.entries()),
      stats: this.stats,
      options: this.options,
    };
    return this.options.serialize(data);
  }

  /**
   * Imports cache data
   */
  import(data: string): void {
    try {
      const imported = this.options.deserialize(data);
      this.cache = new Map(imported.entries);
      this.stats = imported.stats ?? this.stats;
    } catch (error) {
      console.error('Failed to import cache:', error);
    }
  }
}

/**
 * Creates a new cache manager instance
 */
export const createCacheManager = (options?: CacheOptions): CacheManager => {
  return new CacheManager(options);
};

/**
 * Default cache manager instance
 */
export const defaultCache = createCacheManager({
  namespace: 'default',
  ttl: 3600000, // 1 hour
  maxSize: 1000,
  strategy: 'lru',
});

/**
 * Creates a cache manager with persistence
 */
export const createPersistentCache = (namespace: string, options?: Omit<CacheOptions, 'persist' | 'namespace'>): CacheManager => {
  return createCacheManager({
    ...options,
    namespace,
    persist: true,
  });
};

/**
 * Creates a cache manager with short TTL
 */
export const createShortTTLCache = (ttl: number = 60000, options?: Omit<CacheOptions, 'ttl'>): CacheManager => {
  return createCacheManager({
    ...options,
    ttl,
  });
};

/**
 * Creates a cache manager with long TTL
 */
export const createLongTTLCache = (ttl: number = 86400000, options?: Omit<CacheOptions, 'ttl'>): CacheManager => {
  return createCacheManager({
    ...options,
    ttl,
  });
};

