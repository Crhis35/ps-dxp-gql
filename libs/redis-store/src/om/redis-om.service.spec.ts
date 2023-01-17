import { Test, TestingModule } from '@nestjs/testing';
import { RedisOmService } from './redis-om.service';

describe('RedisOmService', () => {
  let service: RedisOmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisOmService],
    }).compile();

    service = module.get<RedisOmService>(RedisOmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
