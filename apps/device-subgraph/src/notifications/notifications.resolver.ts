import {
  Args,
  Mutation,
  Query,
  ResolveReference,
  Resolver,
  Subscription,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  CreateNotificationInput,
  CreateNotificationOutput,
} from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => CreateNotificationOutput)
  async createNotification(
    @Args('input') createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationsService.create(createNotificationInput);
  }

  @Subscription(() => String, {
    resolve: ({ onCreateNotification: { value } }) => value,
  })
  onCreateNotification() {
    return this.notificationsService.onCreateNotification();
  }

  @ResolveField('owner')
  owner(@Parent() notification: Notification) {
    return { __typename: 'User', id: notification.ownerId };
  }

  @ResolveReference()
  async resolveReference(data) {
    console.log({ data });
    return {
      id: 'asasa',
    };
  }
}
