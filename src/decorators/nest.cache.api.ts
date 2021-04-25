/*
 * @Description: 自定义装饰器,如果该接口需要走redis缓存就加上去
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company: 
 * @Date: 2021-03-09 15:47:06
 * @LastEditors: 水痕
 * @LastEditTime: 2021-04-25 12:45:32
 * @FilePath: /nest-api-cache/src/decorators/nest.cache.api.ts
 */
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { REDIS_CACHE_KEY, REDIS_CACHE_EX_SECOND_KEY, REDIS_CONFIG_PROVIDER } from '../constants';
import redisCacheConfig from '../config/redisCache.config';
import { IRedisApiCacheConfig } from '../interfaces';

// 是否缓存
const isCache = true;

/**
 * @Author: 水痕
 * @Date: 2021-03-09 17:05:19
 * @LastEditors: 水痕
 * @Description: 自定义装饰器,用于路由上装饰需要缓存的接口
 * @param {number} exSecond redis缓存过期时间,时间为妙
 * @return {*}
 */
export function NestCacheApi(exSecond: number = redisCacheConfig.redisEXSecond): any {
  return applyDecorators(
    SetMetadata(REDIS_CACHE_KEY, isCache),
    SetMetadata(REDIS_CACHE_EX_SECOND_KEY, exSecond)
  );
}