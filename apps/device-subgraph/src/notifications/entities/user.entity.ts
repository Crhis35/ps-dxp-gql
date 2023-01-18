import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Notification } from './notification.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Directive('@external')
  @Field(() => ID)
  id: number;

  @Field(() => [Notification], { nullable: true })
  notifications?: Notification[];

  // constructor(user: Partial<User>) {
  //   Object.assign(user);
  // }
}
