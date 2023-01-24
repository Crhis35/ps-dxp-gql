import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Entity, Schema } from 'redis-om';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Notification {
  @Field(() => ID)
  @Expose()
  id: string;

  @Field(() => User)
  owner?: User;

  @Field(() => String)
  @Expose()
  ownerId: string;
}

export class INotification extends Entity {
  id: string;
  ownerId: string;
}

export const notificationSchema = new Schema(INotification, {
  ownerId: { type: 'string' },
});
