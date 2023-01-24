import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NotificationPaginationInput } from './dto/list-notification.dto';
import { Notification } from './entities/notification.entity';
import { User } from './entities/user.entity';
import { NotificationsService } from './notifications.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ResolveField(() => [Notification])
  async notifications(
    @Parent() user: User,
    @Args('input') notificationPaginationInput: NotificationPaginationInput,
  ): Promise<Notification[]> {
    return this.notificationsService.listByUser({
      ...notificationPaginationInput,
      ownerId: user.id,
    });
  }
}
