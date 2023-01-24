import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsBase64,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export abstract class PaginationInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsBase64()
  @IsOptional()
  public after?: string;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  public first = 10;
}

@ObjectType()
export class PaginationOffsetOutput {}

@InputType()
export class PaginationOffsetInput {
  @Field(() => Int)
  @IsInt()
  offset: number;

  @Field(() => Int)
  @IsInt()
  count: number;
}
