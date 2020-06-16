// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors({ origin: process.env.ORIGIN });
  app.use(helmet());
  app.use(cookieParser());
  await app.listen(process.env.PORT);

  const logger = new Logger('bootstrap');
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Accepting requests from origin: "${process.env.ORIGIN}"`);
}
bootstrap();
