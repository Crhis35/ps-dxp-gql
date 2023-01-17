import { Test, TestingModule } from '@nestjs/testing';
import { AccountSubgraphController } from './account-subgraph.controller';
import { AccountSubgraphService } from './account-subgraph.service';

describe('AccountSubgraphController', () => {
  let accountSubgraphController: AccountSubgraphController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountSubgraphController],
      providers: [AccountSubgraphService],
    }).compile();

    accountSubgraphController = app.get<AccountSubgraphController>(AccountSubgraphController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(accountSubgraphController.getHello()).toBe('Hello World!');
    });
  });
});
