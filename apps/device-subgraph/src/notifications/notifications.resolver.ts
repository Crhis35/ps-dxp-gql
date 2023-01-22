import {
  InjectRedisCacheManager,
  RedisCacheGQLInterceptor,
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

  @Mutation('detectedDevice')
  async detectedDevice() {
    this.pubSub.publish('CREATED', ['Notification'], {
      onCreateNotification: { value: 'Elegantly' },
    });
    return 'Success!';
  }

  @Query('service')
  async service() {
    console.log(this.cache);
    console.log(await this.cache.get('data'));
    return 'NotificationsResolver';
  }

  @Subscription('onCreateNotification', {
    resolve: ({ onCreateNotification: { value } }) => value,
  })
  onCreateNotification() {
    return this.pubSub.iterator('CREATED', ['Notification']);
  }
}
