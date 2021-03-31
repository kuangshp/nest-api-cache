import { Module, Global, DynamicModule } from '@nestjs/common';
import { REDIS_CONFIG_PROVIDER } from './constants';
import { IRedisApiCacheConfig } from './interfaces';
import { NestApiCacheInterceptor } from './interceptors/redis-api-cache/nest-api-cache.interceptor';
import { RedisCacheService } from './services/redis-cache/redis-cache.service';

@Global()
@Module({})
export class NestApiCacheModule {
  static forRoot(config?: IRedisApiCacheConfig): DynamicModule {
    global[REDIS_CONFIG_PROVIDER] = config;
    return {
      module: NestApiCacheModule,
      imports: [],
      providers: [
        { provide: REDIS_CONFIG_PROVIDER, useValue: config },
        NestApiCacheInterceptor,
        RedisCacheService
      ],
      exports: [
        NestApiCacheInterceptor
      ],
    }
  }
}
