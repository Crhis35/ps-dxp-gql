import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Schema } from 'redis-om';
import { User } from './user.entity';
@ObjectType()
@Directive('@key(fields: "id")')
export class Notification extends Entity {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  actor: User;
}

export const notificationSchema = new Schema(Notification, {
  actor: { type: 'string' },
});
