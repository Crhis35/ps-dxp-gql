import { Test, TestingModule } from '@nestjs/testing';
import { DeviceSubgraphController } from './device-subgraph.controller';
import { DeviceSubgraphService } from './device-subgraph.service';

describe('DeviceSubgraphController', () => {
  let deviceSubgraphController: DeviceSubgraphController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeviceSubgraphController],
      providers: [DeviceSubgraphService],
    }).compile();

    deviceSubgraphController = app.get<DeviceSubgraphController>(DeviceSubgraphController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(deviceSubgraphController.getHello()).toBe('Hello World!');
    });
  });
});
