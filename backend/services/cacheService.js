const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.redisClient = null;
    this.memoryCache = new Map(); // In-memory fallback: key -> { data, expiresAt }
    this.isRedisAvailable = false;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
    };

    this.init();
  }

  init() {
    if (process.env.NODE_ENV === 'test' || (!process.env.REDIS_URL && process.env.REDIS_ENABLED !== 'true')) {
      this.isRedisAvailable = false;
      return;
    }
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    try {
      this.redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop retrying and remain on memory fallback
          }
          return Math.min(times * 100, 1000);
        },
        enableOfflineQueue: false,
        lazyConnect: true,
      });

      this.redisClient.connect()
        .then(() => {
          this.isRedisAvailable = true;
          console.log('⚡ Redis Cache Engine Online: Connected to Redis telemetry.');
        })
        .catch(() => {
          this.isRedisAvailable = false;
          console.log('ℹ️  Redis offline or unconfigured. Seamlessly operating on In-Memory Cache Engine.');
        });

      this.redisClient.on('error', () => {
        this.isRedisAvailable = false;
      });

      this.redisClient.on('close', () => {
        this.isRedisAvailable = false;
      });
    } catch {
      this.isRedisAvailable = false;
      console.log('ℹ️  Redis unavailable. Using resilient In-Memory cache fallback.');
    }
  }

  async get(key) {
    if (this.isRedisAvailable && this.redisClient) {
      try {
        const val = await this.redisClient.get(key);
        if (val !== null) {
          this.stats.hits++;
          return JSON.parse(val);
        }
        this.stats.misses++;
        return null;
      } catch {
        // Fall through to memory fallback
      }
    }

    // In-memory fallback
    const entry = this.memoryCache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  async set(key, value, ttlSeconds = 300) {
    this.stats.sets++;
    const strVal = JSON.stringify(value);

    if (this.isRedisAvailable && this.redisClient) {
      try {
        await this.redisClient.set(key, strVal, 'EX', ttlSeconds);
        return;
      } catch {
        // Fall through to memory
      }
    }

    // In-memory fallback
    this.memoryCache.set(key, {
      data: value,
      expiresAt: Date.now() + (ttlSeconds * 1000),
    });
  }

  async del(key) {
    if (this.isRedisAvailable && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch {
        // Ignored
      }
    }
    this.memoryCache.delete(key);
  }

  async delByPattern(prefix) {
    // Memory
    for (const k of this.memoryCache.keys()) {
      if (k.startsWith(prefix)) {
        this.memoryCache.delete(k);
      }
    }

    // Redis
    if (this.isRedisAvailable && this.redisClient) {
      try {
        const stream = this.redisClient.scanStream({ match: `${prefix}*`, count: 100 });
        stream.on('data', async (keys) => {
          if (keys.length) {
            const pipeline = this.redisClient.pipeline();
            keys.forEach(k => pipeline.del(k));
            await pipeline.exec();
          }
        });
      } catch {
        // Ignored
      }
    }
  }

  async getOrSet(key, fetchFn, ttlSeconds = 300) {
    const cached = await this.get(key);
    if (cached !== null) {
      return { data: cached, source: 'cache' };
    }

    const fresh = await fetchFn();
    if (fresh !== undefined && fresh !== null) {
      await this.set(key, fresh, ttlSeconds);
    }
    return { data: fresh, source: 'db' };
  }

  getMetrics() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) + '%' : '0%';
    return {
      isRedisAvailable: this.isRedisAvailable,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      memoryEntriesCount: this.memoryCache.size,
    };
  }
}

module.exports = new CacheService();
