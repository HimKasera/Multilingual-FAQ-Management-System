const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    });
  }

  async get(key) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, expirySeconds) {
    await this.client.set(
      key,
      JSON.stringify(value),
      'EX',
      expirySeconds
    );
  }

  async del(key) {
    await this.client.del(key);
  }
}

module.exports = new CacheService();