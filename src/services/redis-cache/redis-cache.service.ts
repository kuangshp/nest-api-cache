import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Redis as RedisType } from 'ioredis';
import { ConfigProvider } from 'src/constants';
import { IRedisApiCacheConfig } from 'src/interfaces';
import { eventEmitter } from 'src/utils';
import { RedisService } from 'nestjs-redis';
import * as Redis from 'ioredis';


@Injectable({})
export class RedisCacheService implements OnModuleInit {
  public client: RedisType;
  constructor (
    private readonly redisService: RedisService,
  ) {
    // this.redisService = new RedisService(redisConfig);
  }

  onModuleInit() {
    // const redisConfig = (<IRedisApiCacheConfig>global[ConfigProvider]).redisConfig;
    // const redisService = new RedisService({
    //   defaultKey: '',
    //   clients: {
        
    //   },
    //   size: 0,
    // });
    this.client = this.redisService.getClient();
    // console.log(redisConfig, '===')
    // const {username, password, host, port, db} = redisConfig;
    // const url: string = `redis://${username}:${password}@${host}:${port}/${db}?allowUsernameInURI=true`;
    // this.client = new Redis(url);
    // console.log('初始化1', url);
    // console.log('初始化2', this.client);
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
    if (!second) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', second);
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
    console.log('redis-get方法', this.client);
    const data = await this.client.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 14:58:12
   * @LastEditors: 水痕
   * @Description: 根据key删除redis缓存数据
   * @param key {String}  
   * @return: 
   */
  public async del(key: string): Promise<any> {
    await this.client.del(key);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 15:49:34
   * @LastEditors: 水痕
   * @Description: 清空redis的缓存
   * @param {type} 
   * @return: 
   */
  public async flushall(): Promise<any> {
    await this.client.flushall();
  }
}
