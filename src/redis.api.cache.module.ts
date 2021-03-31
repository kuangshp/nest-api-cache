import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigProvider } from './constants';
import { IRedisApiCacheConfig } from './interfaces';
import { RedisApiCacheInterceptor } from './interceptors/redis-api-cache/redis-api-cache.interceptor';
import { RedisCacheService } from './services/redis-cache/redis-cache.service';
import { eventEmitter } from './utils';
import { RedisUtilsModule } from './services/redis-utils.module';

@Global()
@Module({})
export class RedisApiCacheModule {
  static forRoot(config: IRedisApiCacheConfig): DynamicModule {
    eventEmitter.emit(ConfigProvider, config);
    global[ConfigProvider] = config;
    return {
      module: RedisApiCacheModule,
      imports: [
        RedisUtilsModule
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
