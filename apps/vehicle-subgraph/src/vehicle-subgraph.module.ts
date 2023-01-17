import { Module } from '@nestjs/common';
import { VehicleSubgraphController } from './vehicle-subgraph.controller';
import { VehicleSubgraphService } from './vehicle-subgraph.service';

@Module({
  imports: [],
  controllers: [VehicleSubgraphController],
  providers: [VehicleSubgraphService],
})
export class VehicleSubgraphModule {}
