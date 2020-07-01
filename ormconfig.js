/* eslint-disable @typescript-eslint/no-var-requires */
// This config file is for seeding data only
const SnakeNamingStrategy = require('typeorm-naming-strategies')
  .SnakeNamingStrategy;

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/src/**/*.entity.{js,ts}'],
  seeds: [__dirname + '/src/database/seeds/**/*{.ts,.js}'],
  factories: [__dirname + '/src/database/factories/**/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
};
