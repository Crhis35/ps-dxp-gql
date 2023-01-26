import { RedisOptions } from 'ioredis';
import { BaseConfiguration } from './base-configuration.interface';

export const loadApiConfiguration = (): BaseConfiguration => ({
  playground: process.env['PLAYGROUND'] === 'true' ?? false,
  port: +(process.env['PORT'] ?? 8080),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  globalPrefix: process.env['API_GLOBAL_PREFIX'] ?? 'api',
  apiTitle: process.env['API_TITLE'] ?? 'api-service',
  apiPrefix: process.env['API_PREFIX'] ?? 'API_Service_',
  dbUrl: process.env['DB_URL'] ?? '',
});

export const redisUrlToOptions = (url: string): RedisOptions => {
  if (url.includes('://:')) {
    const arr = url.split('://:')[1].split('@');
    const secondArr = arr[1].split(':');

    return {
      password: arr[0],
      host: secondArr[0],
      port: parseInt(secondArr[1], 10),
    };
  }

  const connectionString = url.split('://')[1];
  const arr = connectionString.split(':');
  console.log({
    host: arr[0],
    port: parseInt(arr[1], 10),
  });
  return {
    host: arr[0],
    port: parseInt(arr[1], 10),
  };
};
