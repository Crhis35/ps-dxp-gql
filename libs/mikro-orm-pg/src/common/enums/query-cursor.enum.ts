import { registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from '../entities/core.entity';

export enum QueryCursorEnum {
  DATE = 'DATE',
  ALPHA = 'ALPHA',
}

registerEnumType(QueryCursorEnum, {
  name: 'QueryCursor',
});

export const getQueryCursor = (cursor: QueryCursorEnum): keyof CoreEntity =>
  cursor === QueryCursorEnum.ALPHA ? 'id' : 'slug';
