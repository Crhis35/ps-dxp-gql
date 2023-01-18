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
