import * as Joi from 'joi';

import { join } from 'path';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

import { AccountSubgraphController } from './account-subgraph.controller';
import { AccountSubgraphService } from './account-subgraph.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from '@lib/common';
import { ConfigModule } from '@nestjs/config';

import { User } from './users/entities/user.entity';
import config from './orm.config';
import { MikroCommonModule } from '@lib/mikro-orm-pg';

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
        REDIS_URL: Joi.string(),
      }),
    }),
    MikroOrmModule.forRoot(config),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'apps/account-subgraph/schema.gql'),
      cors: true,
      path: '/graphql-federated',
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),
    MikroCommonModule,
    UsersModule,
  ],
  controllers: [AccountSubgraphController],
  providers: [AccountSubgraphService],
})
export class AccountSubgraphModule {}
