import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { QueryCursorEnum } from '../enums/query-cursor.enum';
import { OrderInput } from './order.dto';

@InputType()
export abstract class FilterInput extends OrderInput {
  @Field(() => QueryCursorEnum, { defaultValue: QueryCursorEnum.DATE })
  @IsEnum(QueryCursorEnum)
  public cursor: QueryCursorEnum = QueryCursorEnum.DATE;
}
