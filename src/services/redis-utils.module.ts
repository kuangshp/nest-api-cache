import { Module, Global } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { RedisCacheService } from './redis-cache/redis-cache.service';
import { IRedisApiCacheConfig } from 'src/interfaces';
import { ConfigProvider } from 'src/constants';

const redisConfig = (<IRedisApiCacheConfig>global[ConfigProvider]).redisConfig;

@Global()
@Module({
  imports: [
    RedisModule.register(redisConfig),
  ],
  providers: [
    RedisCacheService,
  ],
  exports: [
    RedisCacheService,
  ]
})
export class RedisUtilsModule { }
