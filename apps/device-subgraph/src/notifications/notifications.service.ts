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
  Notification,
  notificationSchema,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private notificationRepository: Repository<Notification>;

  constructor(
    @InjectRedisPubSubService()
    private readonly pubSub: RedisPubSubService,
    @InjectRedisOmService()
    private redisClient: RedisOmService,
  ) {
    console.log(redisClient);
  }

  async create(
    input: CreateNotificationInput,
  ): Promise<CreateNotificationOutput> {
    try {
      this.notificationRepository.createAndSave({});
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  onCreateNotification() {
    return this.pubSub.iterator('CREATED', ['Notification']);
  }

  public async onModuleInit() {
    this.notificationRepository =
      this.redisClient.client.fetchRepository(notificationSchema);

    //    await this.notificationRepository.createIndex();
  }
}
