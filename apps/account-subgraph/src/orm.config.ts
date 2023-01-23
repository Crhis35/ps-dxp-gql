import { LoadStrategy, Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { User } from './users/entities/user.entity';

/*const config: Options =
  process.env.NODE_ENV !== 'production'
    ? {
        debug: true,
        type: 'sqlite',
        dbName: 'test.db',
        highlighter: new SqlHighlighter(),
        entities: [User],
        loadStrategy: LoadStrategy.JOINED,
        allowGlobalContext: true,
      }
    : {
        type: 'postgresql',
        highlighter: new SqlHighlighter()
        clientUrl: process.env.DATABASE_URL,
        entities: [User],
        loadStrategy: LoadStrategy.JOINED,
        allowGlobalContext: true,
      };

*/
const config: Options = {
  type: 'postgresql',
  highlighter: new SqlHighlighter(),
  clientUrl: process.env.DATABASE_URL,
  entities: [User],
  loadStrategy: LoadStrategy.JOINED,
  allowGlobalContext: true,
  dbName: `ps-dxp-${process.env.NODE_ENV}`,
  debug: process.env.NODE_ENV === 'development',
};

export default config;
