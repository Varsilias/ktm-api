import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '../../config/config.service';
import 'dotenv/config';

const config = new ConfigService();

export const ormConfig: DataSourceOptions = {
  type: config.DB_TYPE as unknown as 'postgres', // change to database vendor of choice
  ...(config.inProduction
    ? { url: config.DB_URL }
    : {
        username: config.DB_USER,
        host: config.DB_HOST,
        password: config.DB_PASSWORD,
        port: config.DB_PORT,
        database: config.DB_NAME,
      }),
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: config.DB_SYNC,
  logging: !config.inProduction ? ['error', 'migration', 'warn'] : false,
  migrations: [__dirname + '/../migrations/**{.ts,.js}'],
};

// const inProduction = process.env.NODE_ENV === 'production';

// export const ormConfig = {
//   type: process.env.DB_TYPE as DatabaseType, // change to database vendor of choice
//   ...(inProduction
//     ? { url: process.env.DB_URL }
//     : {
//         username: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT,
//         database: process.env.DB_NAME,
//       }),
//   entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
//   synchronize: Boolean(process.env.DB_SYNC),
//   logging: !inProduction ? ['error', 'migration', 'warn'] : false,
//   migrations: [__dirname + '/../migrations/**{.ts,.js}'],
//   ...(inProduction
//     ? {
//         ssl: {
//           rejectUnauthorized: false,
//         },
//       }
//     : undefined),
// } as DataSourceOptions;

export const AppDataSource = new DataSource(ormConfig);
