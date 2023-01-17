import { Controller, Get } from '@nestjs/common';
import { VehicleSubgraphService } from './vehicle-subgraph.service';

@Controller()
export class VehicleSubgraphController {
  constructor(private readonly vehicleSubgraphService: VehicleSubgraphService) {}

  @Get()
  getHello(): string {
    return this.vehicleSubgraphService.getHello();
  }
}
