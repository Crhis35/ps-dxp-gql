import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService, UserRepository],
})
export class UsersModule {}
