import { Module } from '@nestjs/common';
import { AccountSubgraphController } from './account-subgraph.controller';
import { AccountSubgraphService } from './account-subgraph.service';

@Module({
  imports: [],
  controllers: [AccountSubgraphController],
  providers: [AccountSubgraphService],
})
export class AccountSubgraphModule {}
