import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheGqlService } from './redis-cache-gql.service';

describe('RedisCacheGqlService', () => {
  let service: RedisCacheGqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisCacheGqlService],
    }).compile();

    service = module.get<RedisCacheGqlService>(RedisCacheGqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
