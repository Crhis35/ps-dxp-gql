import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { QueryOrderEnum } from '../enums/query-order.enum';
import { PaginationInput } from './pagination.dto';

@InputType()
export abstract class OrderInput extends PaginationInput {
  @Field(() => QueryOrderEnum, { defaultValue: QueryOrderEnum.DESC })
  @IsEnum(QueryOrderEnum)
  public order: QueryOrderEnum = QueryOrderEnum.DESC;
}
