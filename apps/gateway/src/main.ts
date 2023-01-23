import {
  ApplicationReadiness,
  initWinston,
  loadApiConfiguration,
  setNestApp,
  winstonLogger,
} from '@lib/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
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
  setNestApp(app);
  app.setGlobalPrefix(environment.globalPrefix);

  await app.listen(environment.port, '0.0.0.0');
  const url = await app.getUrl();
  winstonLogger?.info(
    `?? Application is running on port: ${url}/${environment.globalPrefix}`,
  );
  ApplicationReadiness.getInstance().isReady = true;
}
(async (): Promise<void> => {
  await bootstrap();
})().catch((error: Error) => {
  winstonLogger?.error(`Nest application error: ${error.message}`);
});
