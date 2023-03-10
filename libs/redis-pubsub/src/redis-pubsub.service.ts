import { Injectable, Logger } from '@nestjs/common';
import type { OnApplicationBootstrap } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RedisPubSubModuleOptions } from './redis-pubsub.interface';
import type { Redis } from 'ioredis';

@Injectable()
export class RedisPubSubService<
  RedisPubSubTopics extends string = string,
  RedisPubSubMap extends Record<RedisPubSubTopics, any> = any,
> implements OnApplicationBootstrap
{
  private pubSub: RedisPubSub;
  private logger = new Logger();
  constructor(private options: RedisPubSubModuleOptions) {}

  public onApplicationBootstrap() {
    this.pubSub = new RedisPubSub(this.options.options);
    this.logger.log(`Connected redis: ${this.options.options}`);
  }

  public publish<
    Pattern extends RedisPubSubTopics,
    Data extends RedisPubSubMap[Pattern],
  >(
    pattern: Pattern,
    extensions: string | string[] = [],
    payload: Data,
  ): Promise<void> {
    return this.pubSub.publish(this.createTopic(pattern, extensions), payload);
  }

  public subscribe<
    Pattern extends RedisPubSubTopics,
    Data extends RedisPubSubMap[Pattern],
  >(
    pattern: Pattern,
    extensions: string | string[] = [],
    onMessage: (msg: Data) => void,
  ): Promise<number> {
    return this.pubSub.subscribe(
      this.createTopic(pattern, extensions),
      onMessage,
    );
  }

  public unsubscribe(id: number): void {
    return this.pubSub.unsubscribe(id);
  }

  public getClient(): Redis {
    return this.pubSub.getPublisher() as Redis;
  }

  public iterator<Pattern extends RedisPubSubTopics | string>(
    pattern: Pattern,
    extensions: string | string[] = [],
  ): AsyncIterator<any> {
    return this.pubSub.asyncIterator(this.createTopic(pattern, extensions));
  }

  public async getSubscriberCount<Pattern extends RedisPubSubTopics>(
    pattern: Pattern,
    extensions: string | string[] = [],
  ): Promise<number> {
    const topic = this.createTopic(pattern, extensions);
    const numberOfSubs = await this.getClient().call('PUBSUB', [
      'NUMSUB',
      topic,
    ]);

    if (Array.isArray(numberOfSubs) && numberOfSubs?.[1]) {
      return numberOfSubs[1];
    } else {
      return 0;
    }
  }

  public createTopic(pattern: string, extensions: string | string[]): string {
    return [pattern, ...extensions].join(this.options.delimiter);
  }
}
