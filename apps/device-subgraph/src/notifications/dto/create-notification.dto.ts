import { CoreOutput } from '@lib/mikro-orm-pg/common/dto/core.output';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Notification } from '../entities/notification.entity';

@InputType()
export class CreateNotificationInput {
  @Field()
  ownerId: string;
}

@ObjectType()
export class CreateNotificationOutput extends CoreOutput {
  @Field(() => Notification, { nullable: true })
  item?: Notification;
}
