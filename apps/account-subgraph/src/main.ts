import {
  ApplicationReadiness,
  initWinston,
  loadApiConfiguration,
  setNestApp,
  winstonLogger,
} from '@lib/common';
import { NestFactory } from '@nestjs/core';
import { AccountSubgraphModule } from './account-subgraph.module';

async function bootstrap() {
  const environment = loadApiConfiguration();
  initWinston(environment.apiTitle);

  const app = await NestFactory.create(AccountSubgraphModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  setNestApp(app);
  app.setGlobalPrefix(environment.globalPrefix);

  await app.listen(environment.port);
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
