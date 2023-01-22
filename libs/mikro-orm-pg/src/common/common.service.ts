import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Dictionary, FilterQuery } from '@mikro-orm/core';
import { QueryBuilder } from '@mikro-orm/postgresql';
import {
  getOppositeOrder,
  getQueryOrder,
  QueryOrderEnum,
  tOppositeOrder,
  tOrderEnum,
} from './enums/query-order.enum';
import {
  IEdge,
  IBasicPaginated,
  IRelayPaginated,
} from './interfaces/paginated.interface';

@Injectable()
export class CommonService {
  /**
   * Encode Cursor
   *
   * Takes a date, string or integer and returns the base 64
   * representation of it
   */
  private static encodeCursor(val: Date | string | number): string {
    let str: string;

    if (val instanceof Date) {
      str = val.getTime().toString();
    } else if (typeof val === 'number' || typeof val === 'bigint') {
      str = val.toString();
    } else {
      str = val;
    }

    return Buffer.from(str, 'utf-8').toString('base64');
  }

  /**
   * Create Edge
   *
   * Takes an instance, the cursor key and a innerCursor,
   * and generates a GraphQL edge
   */
  private static createEdge<T>(
    instance: T,
    cursor: keyof T,
    innerCursor?: string,
  ): IEdge<T> {
    try {
      return {
        node: instance,
        cursor: CommonService.encodeCursor(
          innerCursor ? instance[cursor][innerCursor] : instance[cursor],
        ),
      };
    } catch (_) {
      throw new InternalServerErrorException('The given cursor is invalid');
    }
  }

  /**
   * Get Order By
   *
   * Makes the order by query for MikroORM orderBy method.
   */
  private static getOrderBy<T>(
    cursor: keyof T,
    order: QueryOrderEnum,
    innerCursor?: string,
  ): Record<string, QueryOrderEnum | Record<string, QueryOrderEnum>> {
    return innerCursor
      ? {
          [cursor]: {
            [innerCursor]: order,
          },
        }
      : {
          [cursor]: order,
        };
  }

  /**
   * Get Filters
   *
   * Gets the where clause filter logic for the query builder pagination
   */
  private static getFilters<T>(
    cursor: keyof T,
    decoded: string | number,
    order: tOrderEnum | tOppositeOrder,
    innerCursor?: string,
  ): FilterQuery<Dictionary<T>> {
    return innerCursor
      ? {
          [cursor]: {
            [innerCursor]: {
              [order]: decoded,
            },
          },
        }
      : {
          [cursor]: {
            [order]: decoded,
          },
        };
  }

  /**
   * Throw Internal Error
   *
   * Function to abstract throwing internal server exception
   */
  public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Decode Cursor
   *
   * Takes a base64 cursor and returns the string or number value
   */
  public decodeCursor(cursor: string, isNum = false): string | number {
    const str = Buffer.from(cursor, 'base64').toString('utf-8');

    if (isNum) {
      const num = parseInt(str, 10);

      if (isNaN(num))
        throw new BadRequestException(
          'Cursor does not reference a valid number',
        );

      return num;
    }

    return str;
  }

  /**
   * Basic Paginate
   *
   * Takes an entity array and returns the paginated type of that entity array
   * It uses cursor pagination as recommended in https://graphql.org/learn/pagination/
   */
  public basicPaginate<T>(
    instances: T[],
    totalCount: number,
    cursor: keyof T,
    first: number,
    innerCursor?: string,
  ): IBasicPaginated<T> {
    const pages: IBasicPaginated<T> = {
      totalCount,
      edges: [],
      pageInfo: {
        endCursor: '',
        hasNextPage: false,
      },
    };
    const len = instances.length;

    if (len > 0) {
      for (let i = 0; i < len; i++) {
        pages.edges.push(
          CommonService.createEdge(instances[i], cursor, innerCursor),
        );
      }
      pages.pageInfo.endCursor = pages.edges[len - 1].cursor;
      pages.pageInfo.hasNextPage = totalCount > first;
    }

    return pages;
  }

  /**
   * Relay Paginate
   *
   * Takes an entity array and returns the paginated type of that entity array
   * It uses cursor pagination as recommended in https://relay.dev/graphql/connections.htm
   */
  public relayPaginate<T>(
    instances: T[],
    currentCount: number,
    previousCount: number,
    cursor: keyof T,
    first: number,
    innerCursor?: string,
  ): IRelayPaginated<T> {
    const pages: IRelayPaginated<T> = {
      currentCount,
      previousCount,
      edges: [],
      pageInfo: {
        endCursor: '',
        startCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
    const len = instances.length;

    if (len > 0) {
      for (let i = 0; i < len; i++) {
        pages.edges.push(
          CommonService.createEdge(instances[i], cursor, innerCursor),
        );
      }
      pages.pageInfo.startCursor = pages.edges[0].cursor;
      pages.pageInfo.endCursor = pages.edges[len - 1].cursor;
      pages.pageInfo.hasNextPage = currentCount > first;
      pages.pageInfo.hasPreviousPage = previousCount > 0;
    }

    return pages;
  }

  /**
   * Basic Query Builder Pagination
   *
   * Takes a query builder and returns the entities paginated
   */
  public async basicQueryBuilderPagination<T extends object>(
    alias: string,
    cursor: keyof T,
    first: number,
    order: QueryOrderEnum,
    qb: QueryBuilder<T>,
    after?: string,
    afterIsNum = false,
    innerCursor?: string,
  ): Promise<IBasicPaginated<T>> {
    if (after) {
      const decoded = this.decodeCursor(after, afterIsNum);
      const qbOrder = getQueryOrder(order);

      qb.andWhere(
        CommonService.getFilters(cursor, decoded, qbOrder, innerCursor),
      );
    }

    const cqb = qb.clone();
    const [count, entities]: [number, T[]] = await this.throwInternalError(
      Promise.all([
        cqb.count(`${alias}.${String(cursor)}`, true),
        qb
          .select(`${alias}.*`)
          .orderBy(CommonService.getOrderBy(cursor, order, innerCursor))
          .limit(first)
          .getResult(),
      ]),
    );

    return this.basicPaginate(entities, count, cursor, first, innerCursor);
  }

  /**
   * Relay Query Builder Pagination
   *
   * Takes a query builder and returns the entities paginated
   */
  public async relayQueryBuilderPagination<T extends object>(
    alias: string,
    cursor: keyof T,
    first: number,
    order: QueryOrderEnum,
    qb: QueryBuilder<T>,
    after?: string,
    afterIsNum = false,
    innerCursor?: string,
  ): Promise<IRelayPaginated<T>> {
    const strCursor = String(cursor);
    const aliasCursor = `${alias}.${strCursor}`;
    let prevCount = 0;

    if (after) {
      const decoded = this.decodeCursor(after, afterIsNum);
      const oppositeOd = getOppositeOrder(order);
      const tempQb = qb.clone();
      tempQb.andWhere(
        CommonService.getFilters(cursor, decoded, oppositeOd, innerCursor),
      );
      prevCount = await tempQb.count(aliasCursor, true);

      const normalOd = getQueryOrder(order);
      qb.andWhere(
        CommonService.getFilters(cursor, decoded, normalOd, innerCursor),
      );
    }

    const cqb = qb.clone();
    const [count, entities]: [number, T[]] = await this.throwInternalError(
      Promise.all([
        cqb.count(aliasCursor, true),
        qb
          .select(`${alias}.*`)
          .orderBy(CommonService.getOrderBy(cursor, order, innerCursor))
          .limit(first)
          .getResult(),
      ]),
    );

    return this.relayPaginate(
      entities,
      count,
      prevCount,
      cursor,
      first,
      innerCursor,
    );
  }
}
