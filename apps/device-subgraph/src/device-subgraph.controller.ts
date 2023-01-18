import { Controller, Get } from '@nestjs/common';
import { DeviceSubgraphService } from './device-subgraph.service';

@Controller()
export class DeviceSubgraphController {
  constructor(private readonly deviceSubgraphService: DeviceSubgraphService) {}

  @Get()
  getHello(): string {
    return this.deviceSubgraphService.getHello();
  }
}
