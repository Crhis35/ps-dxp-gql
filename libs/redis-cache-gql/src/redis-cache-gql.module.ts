import { Module } from '@nestjs/common';
import { RedisCacheGqlService } from './redis-cache-gql.service';

@Module({
  providers: [RedisCacheGqlService],
  exports: [RedisCacheGqlService],
})
export class RedisCacheGqlModule {}
