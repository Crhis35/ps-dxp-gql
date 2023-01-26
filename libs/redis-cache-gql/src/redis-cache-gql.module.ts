import type { DynamicModule, CacheModuleOptions } from '@nestjs/common';
import { CacheModule, CACHE_MANAGER, Global, Module } from '@nestjs/common';
import type { RedisCacheManagerOptions } from './redis-cache-gql.interface';
import { ConfigService } from '@webundsoehne/nestjs-util/dist/provider/config/config.service';
import { RedisCacheGQLInterceptor } from './redis-cache-gql.interceptor';
import { redisUrlToOptions } from '@lib/common';
import { ioredisStore } from './stores/ioredis.store';

@Global()
@Module({
  providers: [RedisCacheGQLInterceptor],
  imports: [
    CacheModule.register({
      ...redisUrlToOptions(process.env.REDIS_URL),
      store: ioredisStore,
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
              store: ioredisStore,
            }),
        },
      ],
      exports: [CACHE_MANAGER],
    };
  }
}
