import { setNestApp, winstonLogger } from '@lib/common';
import { AppModule } from './app.module';

async function bootstrap() {
  return setNestApp(AppModule);
}
(async (): Promise<void> => {
  await bootstrap();
})().catch((error: Error) => {
  winstonLogger?.error(`Nest application error: ${error.message}`);
});
