import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { REDIS_CACHE_KEY, REDIS_CACHE_EX_SECOND_KEY } from '../../constants';
import { RedisApiCacheBaseInterceptor } from './redis-api-cache.base.interceptor';
import { RedisCacheService } from 'src/services/redis-cache/redis-cache.service';

/**
 * @Author: 水痕
 * @Date: 2021-03-08 13:04:56
 * @LastEditors: 水痕
 * @Description: 定义redis缓存接口的中间件。提高接口访问速度
 * @param {*}
 * @return {*}
 */
@Injectable()
export class RedisApiCacheInterceptor implements NestInterceptor {
  private redisCacheService: RedisCacheService;
  constructor() {
    this.redisCacheService = new RedisCacheService()
  }
  
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    // 反射的方法获取接口是否需要缓存
    const isCacheApi = Reflect.getMetadata(REDIS_CACHE_KEY, context.getHandler()) || Reflect.getMetadata(REDIS_CACHE_KEY, context.getClass());
    const redisEXSecond = Reflect.getMetadata(REDIS_CACHE_EX_SECOND_KEY, context.getHandler()) || Reflect.getMetadata(REDIS_CACHE_EX_SECOND_KEY, context.getClass());
    if (isCacheApi) {
      const redisKey = this.redisCacheKey(request.method, request.url);
      const redisData = await this.redisCacheService.get(redisKey);
      if (redisData) {
        return of(redisData);
      } else {
        return next.handle().pipe(map(data => {
          this.redisCacheService.set(redisKey, data, redisEXSecond);
          return data;
        }));
      }
    } else {
      return next.handle();
    }
  }

  private redisCacheKey(method: string, url: string): string {
    return `${method}:${url}`;
  }
}
