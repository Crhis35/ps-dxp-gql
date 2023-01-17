import { NestFactory } from '@nestjs/core';
import { AccountSubgraphModule } from './account-subgraph.module';

async function bootstrap() {
  const app = await NestFactory.create(AccountSubgraphModule);
  await app.listen(3000);
}
bootstrap();
