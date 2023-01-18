import { RedisPubSubService } from '@lib/redis-pubsub';
import { InjectRedisPubSubService } from '@lib/redis-pubsub/inject/inject.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRedisPubSubService() private readonly pubSub: RedisPubSubService,
  ) {}

  testMutation() {
    this.pubSub.publish('CREATED', ['Notification'], {
      pendingOrders: { value: 'Subcribed!' },
    });
    return 'Tested!';
  }
}
