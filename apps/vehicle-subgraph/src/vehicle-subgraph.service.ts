import { Injectable } from '@nestjs/common';

@Injectable()
export class VehicleSubgraphService {
  getHello(): string {
    return 'Hello World!';
  }
}
