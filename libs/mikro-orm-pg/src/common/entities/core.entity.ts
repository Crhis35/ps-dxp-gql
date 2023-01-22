import { PrimaryKey, Property } from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { v4 } from 'uuid';

@ObjectType()
export abstract class CoreEntity {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field()
  @Property({ type: 'string' })
  slug: string;

  @Field(() => GraphQLISODateTime)
  @Property({ type: 'timestamptz' })
  createdAt = new Date();

  @Field(() => GraphQLISODateTime)
  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(body = {}) {
    Object.assign(this, body);
  }
}
