import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());
  const PORT = 3000;
  await app.listen(PORT);
  logger.log(`Nest application listening on port ${PORT}`);
}
bootstrap();
