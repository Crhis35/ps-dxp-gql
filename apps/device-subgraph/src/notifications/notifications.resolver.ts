import {
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { InjectRedisPubSubService } from '@lib/redis-pubsub/inject/inject.decorator';
import { RedisPubSubService } from '@lib/redis-pubsub';
import { User } from './entities/user.entity';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRedisPubSubService() private readonly pubSub: RedisPubSubService,
  ) {}

  @Query(() => String)
  getHello(): string {
    return 'getHello';
  }

  @Mutation(() => String)
  testMutation() {
    return this.notificationsService.testMutation();
  }
  @Subscription(() => String, {
    resolve: ({ pendingOrders: { value } }) => value,
  })
  pendingOrders() {
    return this.pubSub.iterator('CREATED', ['Notification']);
  }
}
