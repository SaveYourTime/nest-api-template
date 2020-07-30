import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.RDS_HOSTNAME,
  port: +process.env.RDS_PORT,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  dropSchema: process.env.RDS_DB_DROP === 'true',
  synchronize: process.env.RDS_DB_SYNC === 'true',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  namingStrategy: new SnakeNamingStrategy(),
};
