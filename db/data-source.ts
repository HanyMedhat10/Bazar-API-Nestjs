import { DataSource, DataSourceOptions } from 'typeorm';
// import {dotenv} from 'dotenv';
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'bazarapi',
  //   autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'], //meaning autoLoadEntities
  migrations: [],
  logging: false,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
