import type {
  DynamicModule,
  CacheModuleOptions,
  CacheStore,
} from '@nestjs/common';
import { CacheModule, CACHE_MANAGER, Global, Module } from '@nestjs/common';
import { RedisCacheManagerOptions } from './redis-cache-gql.interface';
import { RedisCacheGqlService } from './redis-cache-gql.service';
import { ConfigService } from '@webundsoehne/nestjs-util/dist/provider/config/config.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  providers: [RedisCacheGqlService],
  exports: [RedisCacheGqlService],
})
export class RedisCacheGqlModule {
  public static forRoot(options: RedisCacheManagerOptions): DynamicModule {
    return {
      global: options?.global ?? true,
      module: RedisCacheGqlModule,
      providers: [
        {
          provide: CACHE_MANAGER,
          useFactory: (): CacheModule =>
            CacheModule.register({
              ...(options?.options ?? {
                ...ConfigService.get<CacheModuleOptions>('redisCacheManager'),
              }),
              store: redisStore as unknown as CacheStore,
            }),
        },
      ],
      exports: [CACHE_MANAGER],
    };
  }
}
