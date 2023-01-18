import {
  ApplicationReadiness,
  initWinston,
  loadApiConfiguration,
  setNestApp,
  winstonLogger,
} from '@lib/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const enviroment = loadApiConfiguration();
  initWinston(enviroment.apiTitle);

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  setNestApp(app);
  app.setGlobalPrefix(enviroment.globalPrefix);

  await app.listen(enviroment.port);
  const url = await app.getUrl();
  winstonLogger?.info(
    `?? Application is running on port: ${url}/${enviroment.globalPrefix}`,
  );
  ApplicationReadiness.getInstance().isReady = true;
}

(async (): Promise<void> => {
  await bootstrap();
})().catch((error: Error) => {
  winstonLogger?.error(`Nest application error: ${error.message}`);
});
