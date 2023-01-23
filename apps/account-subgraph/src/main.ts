import {
  ApplicationReadiness,
  initWinston,
  loadApiConfiguration,
  setNestApp,
  winstonLogger,
} from '@lib/common';
import { NestFactory } from '@nestjs/core';
import { AccountSubgraphModule } from './account-subgraph.module';
import { MikroORM } from '@mikro-orm/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const environment = loadApiConfiguration();
  initWinston(environment.apiTitle);

  const app = await NestFactory.create<NestFastifyApplication>(
    AccountSubgraphModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    },
  );
  setNestApp(app);
  if (environment.nodeEnv !== 'production') {
    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getSchemaGenerator().updateSchema({
      wrap: false,
    });
  }

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
