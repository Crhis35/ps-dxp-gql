import { CoreOutput } from '@lib/mikro-orm-pg/common/dto/core.output';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  slug: string;
}
@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  item?: User;
}
