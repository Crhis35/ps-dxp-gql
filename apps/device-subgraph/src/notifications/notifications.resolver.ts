import {
  InjectRedisCacheManager,
  RedisCacheManagerProvider,
} from '@lib/redis-cache-gql';
import {
  InjectRedisPubSubService,
  RedisPubSubService,
} from '@lib/redis-pubsub';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRedisPubSubService()
    private readonly pubSub: RedisPubSubService,
    @InjectRedisCacheManager()
    private readonly cache: RedisCacheManagerProvider,
  ) {}

  @Mutation(() => String)
  async detectedDevice() {
    console.log(this.cache);
    this.pubSub.publish('CREATED', ['Notification'], {
      onCreateNotification: { value: 'Elegantly' },
    });
    return 'Success!';
  }

  @Query(() => String)
  async service() {
    return 'NotificationsResolver';
  }

  @Subscription(() => String, {
    resolve: ({ onCreateNotification: { value } }) => value,
  })
  onCreateNotification() {
    return this.notificationsService.onCreateNotification();
  }
}
