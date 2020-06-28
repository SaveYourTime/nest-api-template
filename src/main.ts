// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';

const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Tasks Managament')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
    credentials: process.env.ACCESS_CONTROL_ALLOW_CREDENTIALS === 'true',
  });
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  setupSwagger(app);
  await app.listen(process.env.PORT);

  const logger = new Logger('bootstrap');
  const URL = await app.getUrl();
  logger.log(`Application is running on: ${URL}`);
  logger.log(`Swagger is running on: ${URL}/api`);
  logger.log(
    `Accepting requests from origin: "${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}"`,
  );
}
bootstrap();
