import { DataSource, DataSourceOptions, DatabaseType } from 'typeorm';
import { ConfigService } from '../../config/config.service';

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
  logging: !config.inProduction ? ['error', 'migration', 'warn'] : true,
  migrations: [__dirname + '/../migrations/**{.ts,.js}'],
};

export const AppDataSource = new DataSource(ormConfig);
