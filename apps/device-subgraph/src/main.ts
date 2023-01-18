import {
  loadApiConfiguration,
  setNestApp,
  winstonLogger,
  initWinston,
  ApplicationReadiness,
} from '@lib/common';
import { NestFactory } from '@nestjs/core';
import { DeviceSubgraphModule } from './device-subgraph.module';

async function bootstrap() {
  const environment = loadApiConfiguration();
  initWinston(environment.apiTitle);

  const app = await NestFactory.create(DeviceSubgraphModule, {
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
bootstrap();
// (async (): Promise<void> => {
//   await bootstrap();
// })().catch((error: Error) => {
//   winstonLogger?.error(`Nest application error: ${error.message}`);
// });
