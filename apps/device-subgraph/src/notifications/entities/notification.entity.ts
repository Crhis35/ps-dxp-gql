import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  actor: string;
}
