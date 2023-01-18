import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('user')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
