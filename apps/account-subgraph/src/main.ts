import { AccountSubgraphModule } from './account-subgraph.module';
import { MikroORM } from '@mikro-orm/core';

import { loadApiConfiguration, setNestApp, winstonLogger } from '@lib/common';

async function bootstrap() {
  return setNestApp(AccountSubgraphModule);
}
(async (): Promise<void> => {
  const environment = loadApiConfiguration();
  console.log({ environment });
  const app = await bootstrap();
  if (environment.nodeEnv !== 'production') {
    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getSchemaGenerator().updateSchema({
      wrap: false,
    });
  }
})().catch((error: Error) => {
  winstonLogger?.error(`Nest application error: ${error.message}`);
});
