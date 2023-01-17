import { Test, TestingModule } from '@nestjs/testing';
import { VehicleSubgraphController } from './vehicle-subgraph.controller';
import { VehicleSubgraphService } from './vehicle-subgraph.service';

describe('VehicleSubgraphController', () => {
  let vehicleSubgraphController: VehicleSubgraphController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VehicleSubgraphController],
      providers: [VehicleSubgraphService],
    }).compile();

    vehicleSubgraphController = app.get<VehicleSubgraphController>(VehicleSubgraphController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(vehicleSubgraphController.getHello()).toBe('Hello World!');
    });
  });
});
