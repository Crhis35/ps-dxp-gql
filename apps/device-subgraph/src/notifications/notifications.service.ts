import { winstonLogger } from '@lib/common';
import {
  InjectRedisPubSubService,
  RedisPubSubService,
} from '@lib/redis-pubsub';
import { InjectRedisOmService, RedisOmService } from '@lib/redis-store';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'redis-om';
import {
  CreateNotificationInput,
  CreateNotificationOutput,
} from './dto/create-notification.dto';
import {
  INotification,
  notificationSchema,
} from './entities/notification.entity';
import { NotificationPaginationInput } from './dto/list-notification.dto';

type PaginationNotificationInput = NotificationPaginationInput & {
  ownerId: string;
};

@Injectable()
export class NotificationsService implements OnModuleInit {
  private notificationRepository: Repository<INotification>;

  constructor(
    @InjectRedisPubSubService()
    private readonly pubSub: RedisPubSubService,
    @InjectRedisOmService()
    private redisClient: RedisOmService,
  ) {}

  async create(
    input: CreateNotificationInput,
  ): Promise<CreateNotificationOutput> {
    try {
      winstonLogger?.info(`Create user ${JSON.stringify(input)}`);

      const newItem = await this.notificationRepository.createAndSave({
        ...input,
      });

      const item = {
        id: newItem.entityId,
        ownerId: newItem.ownerId,
      };

      this.pubSub.publish('CREATED', ['Notification'], {
        onCreateNotification: { value: item },
      });

      return {
        ok: true,
        item,
      };
    } catch (error) {
      winstonLogger?.error(`Creating user:  ${error.message}`);

      return {
        ok: false,
        error: error.message,
      };
    }
  }

  onCreateNotification() {
    console.log(this.pubSub.iterator('CREATED', ['Notification']));
    return this.pubSub.iterator('CREATED', ['Notification']);
  }

  async listByUser(input: PaginationNotificationInput) {
    const items = await this.notificationRepository
      .search()
      .where('ownerId')
      .eq(input.ownerId)
      .page(input.offset, input.count);

    return this.parseNotification(items);
  }
  parseNotification(items: INotification[]) {
    return items.map((item) => ({
      id: item.entityId,
      ownerId: item.ownerId,
    }));
  }

  public async onModuleInit() {
    this.notificationRepository =
      this.redisClient.client.fetchRepository(notificationSchema);
    await this.notificationRepository.createIndex();
  }
}
