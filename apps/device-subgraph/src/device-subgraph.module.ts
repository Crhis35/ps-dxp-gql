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
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification.entity';
import { RedisPubsubModule } from '@lib/redis-pubsub';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      sortSchema: true,
      subscriptions: {
        //        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      autoSchemaFile: join(
        process.cwd(),
        'apps/device-subgraph/schema-sub.gql',
      ),
      path: '/graphql',
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'apps/device-subgraph/schema.gql'),
      cors: true,
      path: '/graphql-federated',
      buildSchemaOptions: {
        orphanedTypes: [Notification],
      },
    }),
    NotificationsModule,
  ],
  controllers: [DeviceSubgraphController],
  providers: [DeviceSubgraphService],
})
export class DeviceSubgraphModule {}
