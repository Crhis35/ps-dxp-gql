import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Schema } from 'redis-om';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  owner?: User;

  @Field(() => String)
  ownerId: string;
}

export class INotification extends Entity {
  id: string;
  ownerId: string;
}

export const notificationSchema = new Schema(INotification, {
  ownerId: { type: 'string' },
});
