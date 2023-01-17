import { Controller, Get } from '@nestjs/common';
import { AccountSubgraphService } from './account-subgraph.service';

@Controller()
export class AccountSubgraphController {
  constructor(private readonly accountSubgraphService: AccountSubgraphService) {}

  @Get()
  getHello(): string {
    return this.accountSubgraphService.getHello();
  }
}
