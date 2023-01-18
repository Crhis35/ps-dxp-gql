import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceSubgraphService {
  getHello(): string {
    return 'Hello World!';
  }
}
