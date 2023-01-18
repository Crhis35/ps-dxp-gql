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
  const enviroment = loadApiConfiguration();
  initWinston(enviroment.apiTitle);

  const app = await NestFactory.create(DeviceSubgraphModule, {});

  setNestApp(app);
  app.setGlobalPrefix(enviroment.globalPrefix);

  await app.listen(enviroment.port);
  const url = await app.getUrl();
  winstonLogger?.info(
    `?? Application is running on port: ${url}/${enviroment.globalPrefix}`,
  );
  ApplicationReadiness.getInstance().isReady = true;
}
bootstrap();
/*
(async (): Promise<void> => {
  await bootstrap();
})().catch((error: Error) => {
  winstonLogger?.error(`Nest application error: ${error.message}`);
});*/
