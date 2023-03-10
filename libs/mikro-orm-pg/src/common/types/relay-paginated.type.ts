import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Edge } from './edge.type';
import {
  IRelayPageInfo,
  IRelayPaginated,
} from '../interfaces/paginated.interface';

@ObjectType('RelayPageInfo')
abstract class PageInfoType implements IRelayPageInfo {
  @Field(() => String)
  public startCursor: string;

  @Field(() => String)
  public endCursor: string;

  @Field(() => Boolean)
  public hasNextPage: boolean;

  @Field(() => Boolean)
  public hasPreviousPage: boolean;
}

export function RelayPaginated<T>(classRef: Type<T>): Type<IRelayPaginated<T>> {
  @ObjectType(`${classRef.name}RelayEdge`)
  abstract class EdgeType extends Edge(classRef) {}

  @ObjectType({ isAbstract: true })
  abstract class RelayPaginatedType implements IRelayPaginated<T> {
    @Field(() => Int, { nullable: true })
    public previousCount: number;

    @Field(() => Int, { nullable: true })
    public currentCount: number;

    @Field(() => [EdgeType], { nullable: true })
    public edges: EdgeType[];

    @Field(() => PageInfoType, { nullable: true })
    public pageInfo: PageInfoType;
  }

  return RelayPaginatedType as Type<IRelayPaginated<T>>;
}
