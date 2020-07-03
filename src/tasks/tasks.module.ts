import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from '../config/multer.config';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    MulterModule.register(MulterConfig),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
