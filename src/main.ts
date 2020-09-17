// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { NestFactory, Reflector } from '@nestjs/core';
import {
  Logger,
  ValidationPipe,
  INestApplication,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/guards/roles.guard';

const {
  PORT = 5000,
  WEB_HOST = 'http://localhost:3000',
  ADMIN_HOST = 'http://localhost:4000',
  ACCESS_CONTROL_ALLOW_CREDENTIALS = 'true',
} = process.env;

const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Tasks Managament')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('token')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: [WEB_HOST, ADMIN_HOST],
    credentials: ACCESS_CONTROL_ALLOW_CREDENTIALS === 'true',
  });
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  // app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && req.url === '/') {
      return res.status(200).send('<h1>Hello World!</h1>');
    }
    next();
  });

  setupSwagger(app);
  await app.listen(PORT);

  const logger = new Logger('bootstrap');
  const URL = await app.getUrl();
  logger.log(`Application is running on: ${URL}`);
  logger.log(`Swagger is running on: ${URL}/api`);
  logger.log(`Accepting requests from origin: [${[WEB_HOST, ADMIN_HOST]}]`);
}
bootstrap();
