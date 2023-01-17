import { NestFactory } from '@nestjs/core';
import { VehicleSubgraphModule } from './vehicle-subgraph.module';

async function bootstrap() {
  const app = await NestFactory.create(VehicleSubgraphModule);
  await app.listen(3000);
}
bootstrap();
