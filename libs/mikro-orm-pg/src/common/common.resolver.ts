import { ObjectType, Resolver, Query, Args, Field } from '@nestjs/graphql';
import { RelayPaginated } from './types';
import { MikroCommonService } from '.';
import { SearchInput } from './dto/search.dto';
import { getQueryCursor } from './enums/query-cursor.enum';
import { CoreEntity } from './entities/core.entity';
import { Type } from '@nestjs/common';
import { AbstractRepository } from './common.repository';

export function createBaseResolver<T extends CoreEntity, K extends Type<T>>(
  suffix: string,
  objectTypeCls: K,
) {
  @ObjectType(`RelayPaginated${objectTypeCls.name}Response`)
  class Paginated extends RelayPaginated<T>(objectTypeCls) {
    @Field({ nullable: true })
    error?: string;

    @Field()
    ok?: boolean;
  }

  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    constructor(
      readonly commonService: MikroCommonService,
      readonly customRepository: AbstractRepository<T>,
    ) {}
    @Query(() => Paginated, { name: `listAll${suffix}s`, nullable: true })
    async listAll(
      @Args('input')
      { order, first, after, cursor }: SearchInput,
    ): Promise<Paginated> {
      try {
        const qb = this.customRepository.createQueryBuilder(suffix);
        const result = await this.commonService.relayQueryBuilderPagination(
          suffix,
          getQueryCursor(cursor),
          first,
          order,
          qb,
          after,
        );
        return {
          ...result,
          ok: true,
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
        };
      }
    }
  }

  return BaseResolver;
}
