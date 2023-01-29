import { DeviceSubgraphModule } from './device-subgraph.module';

import { setNestApp, winstonLogger } from '@lib/common';

async function bootstrap() {
  return setNestApp(DeviceSubgraphModule);
}
(async (): Promise<void> => {
  await bootstrap();
})().catch((error: Error) => {
  winstonLogger?.error(`Nest application error: ${error.message}`);
});
