import { initWinston, winstonLogger } from '@lib/common/lib/logging';
import { ApplicationReadiness } from '@lib/common/lib/readiness/readiness.model';
import { secureApplication } from '@lib/common/lib/security/helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  initWinston('');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  secureApplication(app);

  const globalPrefix = process.env.GLOBAL_PREFIX ?? 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 8080;

  await app.listen(port);
  const url = await app.getUrl();
  winstonLogger?.info(
    `?? Application is running on port: ${url}/${globalPrefix}`,
  );
  ApplicationReadiness.getInstance().isReady = true;
}
bootstrap();
