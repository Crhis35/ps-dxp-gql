import * as Joi from 'joi';

import { join } from 'path';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule, HttpException, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AccountSubgraphController } from './account-subgraph.controller';
import { AccountSubgraphService } from './account-subgraph.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from '@lib/common';
import { ConfigModule } from '@nestjs/config';

import config from './orm.config';
import { MikroCommonModule } from '@lib/mikro-orm-pg';
import {
  MercuriusFederationDriver,
  MercuriusFederationDriverConfig,
} from '@nestjs/mercurius';
import { GraphQLError } from 'graphql';
import { CacheConfig, RedisCacheGQLInterceptor } from '@lib/redis-cache-gql';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? join(process.cwd(), 'apps/account-subgraph/.env.development.local')
          : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        PORT: Joi.number(),
        REDIS_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    MikroOrmModule.forRoot(config),
    GraphQLModule.forRoot<MercuriusFederationDriverConfig>({
      driver: MercuriusFederationDriver,
      autoSchemaFile: join(
        process.cwd(),
        'apps/account-subgraph/src/schema.gql',
      ),
      graphiql: true,
      ide: true,
      federationMetadata: true,
      routes: true,
      errorFormatter: (error) => {
        const org = error.errors[0].originalError as HttpException;

        return {
          statusCode: (org.getStatus && org.getStatus()) ?? 400,
          response: {
            errors: (org.getResponse
              ? [org.getResponse()]
              : error.errors) as GraphQLError[],
            data: null,
          },
        };
      },
    }),
    MikroCommonModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfig,
    }),
    UsersModule,
  ],
  controllers: [AccountSubgraphController],
  providers: [
    AccountSubgraphService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisCacheGQLInterceptor,
    },
  ],
})
export class AccountSubgraphModule {}
