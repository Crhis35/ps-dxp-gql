import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [NotificationsResolver, NotificationsService, UsersResolver],
})
export class NotificationsModule {}
