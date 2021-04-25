import { Module, Global, DynamicModule } from '@nestjs/common';
import { REDIS_CACHE_KEY } from './constants';
import { IRedisApiCacheConfig } from './interfaces';
import { NestApiCacheInterceptor } from './interceptors/redis-api-cache/nest-api-cache.interceptor';
import { RedisCacheService } from './services/redis-cache/redis-cache.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({})
export class NestApiCacheModule {
  static forRoot(config?: IRedisApiCacheConfig): DynamicModule {
    const { redisConfig } = config || {};
    return {
      module: NestApiCacheModule,
      imports: [],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: NestApiCacheInterceptor,
        },
        {
          provide: REDIS_CACHE_KEY,
          useValue: redisConfig ?? {},
        },
        RedisCacheService
      ],
      exports: [],
    }
  }
}
