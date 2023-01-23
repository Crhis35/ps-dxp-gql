import * as Joi from 'joi';

import { join } from 'path';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpException, Module } from '@nestjs/common';
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
          statusCode: org.getStatus(),
          response: {
            errors: [org.getResponse() as GraphQLError],
            data: null,
          },
        };
      },
    }),
    MikroCommonModule,
    UsersModule,
  ],
  controllers: [AccountSubgraphController],
  providers: [AccountSubgraphService],
})
export class AccountSubgraphModule {}
