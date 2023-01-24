import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { MikroCommonService, createBaseResolver } from '@lib/mikro-orm-pg';
import { UserRepository } from './user.repository';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { winstonLogger } from '@lib/common';

const UsersBaseResolver = createBaseResolver<User, any>('User', User);

@Resolver(() => User)
export class UsersResolver extends UsersBaseResolver {
  constructor(
    readonly commonService: MikroCommonService,
    readonly userRepository: UserRepository,
  ) {
    super(commonService, userRepository);
  }
  @Query(() => String)
  service() {
    return 'UsersResolver';
  }
  @Mutation(() => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      winstonLogger?.info(`Create user ${JSON.stringify(createUserInput)}`);
      const item = await this.userRepository.create(createUserInput);

      return {
        item,
        ok: true,
      };
    } catch (error) {
      winstonLogger?.error(error.message);
      return {
        ok: false,
        error: error.message,
      };
    }
  }
  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    console.log({ reference });
    return this.userRepository.findOne({
      id: reference.id,
    });
  }
}
