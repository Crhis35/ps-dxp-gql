import { CommonModule } from '@lib/common';

import { CacheModule, HttpException, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { DeviceSubgraphController } from './device-subgraph.controller';
import { DeviceSubgraphService } from './device-subgraph.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { RedisPubsubModule, RedisPubSubService } from '@lib/redis-pubsub';
import { NotificationsModule } from './notifications/notifications.module';
import { RedisCacheGqlModule } from '@lib/redis-cache-gql';
import {
  MercuriusFederationDriver,
  MercuriusFederationDriverConfig,
} from '@nestjs/mercurius';
import { GraphQLError } from 'graphql';
import { RedisOmModule } from '@lib/redis-store';
import { RedisOptions } from 'ioredis';
import { User } from './notifications/entities/user.entity';
import { Notification } from './notifications/entities/notification.entity';

export const redisUrlToOptions = (url: string): RedisOptions => {
  if (url.includes('://:')) {
    const arr = url.split('://:')[1].split('@');
    const secondArr = arr[1].split(':');

    return {
      password: arr[0],
      host: secondArr[0],
      port: parseInt(secondArr[1], 10),
    };
  }

  const connectionString = url.split('://')[1];
  const arr = connectionString.split(':');
  console.log({
    host: arr[0],
    port: parseInt(arr[1], 10),
  });
  return {
    host: arr[0],
    port: parseInt(arr[1], 10),
  };
};

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? join(process.cwd(), 'apps/device-subgraph/.env.development.local')
          : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        PORT: Joi.number(),
        REDIS_URL: Joi.string(),
      }),
    }),
    RedisPubsubModule.forRoot({
      options: {
        connection: process.env.REDIS_URL,
      },
    }),
    RedisOmModule.forRoot({
      global: true,
      url: process.env.REDIS_URL,
    }),
    RedisCacheGqlModule.forRoot({
      global: true,
      options: {
        ...redisUrlToOptions(process.env.REDIS_URL),
      } as any,
    }),
    GraphQLModule.forRoot<MercuriusFederationDriverConfig>({
      driver: MercuriusFederationDriver,
      graphiql: process.env.NODE_ENV !== 'production',
      sortSchema: true,
      subscription: {
        fullWsTransport: true,
      },
      buildSchemaOptions: {
        orphanedTypes: [Notification],
      },
      autoSchemaFile: join(
        process.cwd(),
        'apps/device-subgraph/src/schema.gql',
      ),
      ide: true,
      federationMetadata: true,
      routes: true,
      errorFormatter: (error) => {
        const org = error.errors[0].originalError as HttpException;
        return {
          statusCode: (org?.getStatus && org.getStatus()) ?? 400,
          response: {
            errors: (org?.getResponse
              ? [org.getResponse()]
              : error.errors) as GraphQLError[],
            data: null,
          },
        };
      },
    }),
    NotificationsModule,
  ],
  controllers: [DeviceSubgraphController],
  providers: [DeviceSubgraphService],
})
export class DeviceSubgraphModule {}
