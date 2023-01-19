import { CommonModule } from '@lib/common';
import {
  ApolloDriver,
  ApolloDriverConfig,
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { DeviceSubgraphController } from './device-subgraph.controller';
import { DeviceSubgraphService } from './device-subgraph.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { RedisPubsubModule } from '@lib/redis-pubsub';
import { NotificationsModule } from './notifications/notifications.module';

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
    RedisPubsubModule.forRoot({}),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['./**/*.{graphql,graphql.federation}'],
      cors: true,
      path: '/graphql-federated',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      typePaths: ['./**/*.{graphql,graphql.normal}'],
      definitions: {
        path: join(process.cwd(), 'apps/device-subgraph/src/graphql/schema.ts'),
      },
      path: '/graphql',
    }),
    NotificationsModule,
  ],
  controllers: [DeviceSubgraphController],
  providers: [DeviceSubgraphService],
})
export class DeviceSubgraphModule {}
