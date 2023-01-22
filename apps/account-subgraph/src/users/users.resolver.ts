import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
      console.error(error);
      winstonLogger?.error(error.message);
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
