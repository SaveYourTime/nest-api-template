import { exec } from 'child_process';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ServeStaticModule.forRoot({ serveRoot: '/upload', rootPath: join(__dirname, '..', 'upload') }),
    AuthModule,
    UsersModule,
    ProvidersModule,
    TasksModule,
  ],
})
export class AppModule {
  onApplicationBootstrap(): void {
    exec('npm run seed:run');
  }
}
