import * as redis from 'redis';
import { promisify } from 'util';
import Config from '../../config';
import Logger from './Logger';

class Redis {
  private static logger = Logger.getLogger('Redis');
  static client?: redis.RedisClient;

  static async getAsync(key: string) {
    if (!this.client) {
      throw new Error('Redis is not initalized');
    }
    return await promisify(this.client.get).bind(this.client)(key);
  }

  static async set(key: string, value: any) {
    if (!this.client) {
      throw new Error('Redis is not initalized');
    }
    this.client.set(key, value, 'EX', Config.redis.expireTime || 10); // default will expire 10s
  }

  static async init() {
    if (this.client) {
      throw new Error('Redis is already be initalized');
    }

    this.client = redis.createClient(Config.redis.port, Config.redis.host);

    this.logger.info('Connecting to Redis...');

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        this.logger.info('Connected to Redis');
        resolve(this.client);
      });

      this.client.on('error', (err) => {
        reject('Something went wrong ' + err);
      });
    });
  }
}

export default Redis;
