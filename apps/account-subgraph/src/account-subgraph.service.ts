import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountSubgraphService {
  getHello(): string {
    return 'Hello World!';
  }
}
