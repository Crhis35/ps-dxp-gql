import { CoreEntity } from '@lib/mikro-orm-pg';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Property } from '@mikro-orm/core';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends CoreEntity {
  @Field()
  @Property({ type: 'string' })
  name: string;
}
