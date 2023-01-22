import { MikroAbstractRepository } from '@lib/mikro-orm-pg';
import { User } from './entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UserRepository extends MikroAbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    readonly userRepository: EntityRepository<User>,
  ) {
    super(userRepository);
  }
}
