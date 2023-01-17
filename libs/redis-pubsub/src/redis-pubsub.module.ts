import { DynamicModule, Module } from '@nestjs/common';
import {
  REDIS_PUBSUB_DELIMITER,
  REDIS_PUBSUB_INSTANCE,
} from './redis-pubsub.constants';
import { RedisPubSubService } from './redis-pubsub.service';
import { ConfigService } from '@webundsoehne/nestjs-util/dist/provider/config/config.service';
import type { RedisOptions } from 'ioredis';
import { RedisPubSubModuleOptions } from './redis-pubsub.interface';

@Module({
  providers: [
    {
      provide: REDIS_PUBSUB_INSTANCE,
      useFactory: (): RedisPubSubService<any, any> =>
        new RedisPubSubService({
          delimiter: REDIS_PUBSUB_DELIMITER,
          options: {
            connection: ConfigService.get<RedisOptions>('redisPubSub'),
          },
        }),
    },
  ],
  exports: [REDIS_PUBSUB_INSTANCE],
})
export class RedisPubsubModule {
  public static forRoot(options?: RedisPubSubModuleOptions): DynamicModule {
    return {
      global: options?.global ?? true,
      module: RedisPubsubModule,
      providers: [
        {
          provide: REDIS_PUBSUB_INSTANCE,
          useFactory: (): RedisPubSubService<any, any> =>
            new RedisPubSubService({
              delimiter: options?.delimiter ?? REDIS_PUBSUB_DELIMITER,
              options: {
                ...(options?.options ?? {
                  connection: ConfigService.get<RedisOptions>('redisPubSub'),
                }),
              },
            }),
        },
      ],
      exports: [REDIS_PUBSUB_INSTANCE],
    };
  }
}
