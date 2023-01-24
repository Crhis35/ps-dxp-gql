import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Notification } from './notification.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  id: string;

  @Field(() => [Notification], { nullable: true })
  notifications?: Notification[];
}
