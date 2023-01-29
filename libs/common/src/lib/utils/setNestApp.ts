import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { CustomValidationError } from './filters/CustomValidationError';
import { loadApiConfiguration } from '../config/base-configuration';
import { NestFactory } from '@nestjs/core';
import { initWinston, winstonLogger } from '../logging';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ApplicationReadiness } from '../readiness/readiness.model';

export async function setNestApp<T>(AppModule: T) {
  const environment = loadApiConfiguration();
  initWinston(environment.apiTitle);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    },
  );
  app.setGlobalPrefix(environment.globalPrefix);

  await app.listen(environment.port, '0.0.0.0');
  const url = await app.getUrl();
  winstonLogger?.info(
    `🚀 Application is running on port: ${url}/${environment.globalPrefix}`,
  );

  ApplicationReadiness.getInstance().isReady = true;
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((e) => new CustomValidationError(e)),
        );
      },
    }),
  );
  return app;
}
