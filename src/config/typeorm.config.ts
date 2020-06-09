import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  // type: 'postgres',
  host: 'localhost',
  port: 33066,
  username: 'root',
  password: '123',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // autoLoadEntities: true,
  synchronize: true,
};
