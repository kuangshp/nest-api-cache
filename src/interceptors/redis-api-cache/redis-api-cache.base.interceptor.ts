
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RedisCacheService } from '../../services/redis-cache/redis-cache.service';

@Injectable()
export class RedisApiCacheBaseInterceptor implements NestInterceptor {
  constructor (
    public readonly redisCacheService: RedisCacheService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): import("rxjs").Observable<any> | Promise<import("rxjs").Observable<any>> {
    throw new Error('Method not implemented.');
  }
}