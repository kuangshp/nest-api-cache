import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigProvider } from './constants';
import { IRedisApiCacheConfig } from './interfaces';
import { RedisApiCacheInterceptor } from './interceptors/redis-api-cache/redis-api-cache.interceptor';
import { RedisCacheService } from './services/redis-cache/redis-cache.service';

@Global()
@Module({})
export class RedisApiCacheModule {
  static forRoot(config: IRedisApiCacheConfig): DynamicModule {
    return {
      module: RedisApiCacheModule,
      imports: [
      ],
      providers: [
        { provide: ConfigProvider, useValue: config },
        RedisApiCacheInterceptor,
        RedisCacheService
      ],
      exports: [
        RedisApiCacheInterceptor
      ],
    }
  }
}
