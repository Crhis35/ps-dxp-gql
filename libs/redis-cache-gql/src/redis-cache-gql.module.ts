import type {
  DynamicModule,
  CacheModuleOptions,
  CacheStore,
} from '@nestjs/common';
import { CacheModule, CACHE_MANAGER, Global, Module } from '@nestjs/common';
import type { RedisCacheManagerOptions } from './redis-cache-gql.interface';
import { ConfigService } from '@webundsoehne/nestjs-util/dist/provider/config/config.service';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheGQLInterceptor } from './redis-cache-gql.interceptor';

@Global()
@Module({
  providers: [RedisCacheGQLInterceptor],
  imports: [
    CacheModule.register({
      ...ConfigService.get<CacheModuleOptions>('redisCacheManager'),
      store: redisStore as unknown as CacheStore,
    }),
  ],
  exports: [CacheModule],
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
