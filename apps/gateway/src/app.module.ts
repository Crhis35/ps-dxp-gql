import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { getServiceList } from './utils';
import { CommonModule } from '@lib/common';
import {
  MercuriusGatewayDriver,
  MercuriusGatewayDriverConfig,
} from '@nestjs/mercurius';
import { GraphQLError } from 'graphql';

console.log(getServiceList());
@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? join(process.cwd(), 'apps/gateway/.env.development.local')
          : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        SERVICE_LIST: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    GraphQLModule.forRoot<MercuriusGatewayDriverConfig>({
      driver: MercuriusGatewayDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'apps/gateway/src/schema.gql'),
      federationMetadata: true,
      gateway: {
        services: getServiceList(),
        pollingInterval: 10000,
      },
      sortSchema: true,
      subscription: {
        fullWsTransport: true,
      },
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
