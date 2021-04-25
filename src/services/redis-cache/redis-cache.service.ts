import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Redis as RedisType } from 'ioredis';
import { REDIS_CACHE_KEY } from './../../constants';
import { IRedisConfig } from './../../interfaces';
import * as Redis from 'ioredis';


@Injectable({})
export class RedisCacheService implements OnModuleInit {
  public client: RedisType;
  constructor (
    @Inject(REDIS_CACHE_KEY) private readonly redisConfig: IRedisConfig,
  ) { }
  onModuleInit() {
    this.client = this.connectRedis;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 14:53:37
   * @LastEditors: 水痕
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值 
   * @param value {String} key的值 
   * @param second {Number} 过期时间秒
   * @return: Promise<any>
   */
  public async set(key: string, value: any, second?: number): Promise<any> {
    value = JSON.stringify(value);
    const client = this.client ?? this.connectRedis;
    if (!second) {
      await client.set(key, value);
    } else {
      await client.set(key, value, 'EX', second);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 14:55:14
   * @LastEditors: 水痕
   * @Description: 设置获取redis缓存中的值
   * @param key {String} 
   */
  public async get(key: string): Promise<any> {
    const client = this.client ?? this.connectRedis;
    const data = await client.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-31 10:13:20
   * @LastEditors: 水痕
   * @Description: 连接redis句柄
   * @param {*}
   * @return {*}
   */
  private get connectRedis(): RedisType {
    // const redisConfig = (<IRedisApiCacheConfig>global[REDIS_CONFIG_PROVIDER])?.redisConfig;
    const { username = '', password = '', host = '127.0.0.1', port = 6379, db = 0 } = this.redisConfig || {};
    let url: string = null;
    if (username && password) {
      url = `redis://${username}:${password}@${host}:${port}/${db}?allowUsernameInURI=true`;
    } else {
      url = `redis://${host}:${port}/${db}?allowUsernameInURI=true`
    }
    return new Redis(url);
  }
}
