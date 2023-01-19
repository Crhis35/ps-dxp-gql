import { RedisPubSubService } from '@lib/redis-pubsub';
import { InjectRedisPubSubService } from '@lib/redis-pubsub/inject/inject.decorator';
import { Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRedisPubSubService() private readonly pubSub: RedisPubSubService,
  ) {}

  @Mutation('detectedDevice')
  async detectedDevice() {
    this.pubSub.publish('CREATED', ['Notification'], {
      onCreateNotification: { value: 'Elegantly' },
    });
    return 'Success!';
  }

  @Subscription('onCreateNotification', {
    resolve: ({ onCreateNotification: { value } }) => value,
  })
  onCreateNotification() {
    return this.pubSub.iterator('CREATED', ['Notification']);
  }
}
