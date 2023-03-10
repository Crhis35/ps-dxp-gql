import type { CallHandler, NestInterceptor } from '@nestjs/common';
import { CACHE_TTL_METADATA, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { GraphQLExecutionContext } from '@nestjs/graphql';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRedisCacheManager } from './inject/inject.decorator';
import { REDIS_CACHE_MANAGER_DELIMITER } from './redis-cache-gql.constants';
import { RedisCacheManagerProvider } from './redis-cache-gql.interface';
const IgnoredPropertyName = Symbol('graphql');

@Injectable()
export class RedisCacheGQLInterceptor implements NestInterceptor {
  private logger = new Logger();

  constructor(
    @InjectRedisCacheManager() private cache: RedisCacheManagerProvider,
    protected readonly reflector: Reflector,
  ) {}

  public async intercept(
    context: GraphQLExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const isIgnored = context.getHandler()[IgnoredPropertyName];
    if (isIgnored) {
      return next.handle();
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
    const [_u, args, _s, field] = context.getArgs();
    const ttl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );
    const stringifyedArgs = JSON.stringify(args);

    const key = this.createTopic(field.fieldName, stringifyedArgs);

    const cached = await this.cache.get(key);

    if (cached) {
      this.logger.debug(`Using cache for GraphQL: ${key}`);

      return of(cached);
    }

    return next.handle().pipe(tap((data) => this.cache.set(key, data, ttl)));
  }

  public createTopic(pattern: string, extensions: string | string[]): string {
    return [pattern, ...extensions].join(REDIS_CACHE_MANAGER_DELIMITER);
  }
}
