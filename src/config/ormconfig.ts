import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dropSchema: process.env.DB_DROP === 'true',
  synchronize: process.env.DB_SYNC === 'true',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  namingStrategy: new SnakeNamingStrategy(),
};
