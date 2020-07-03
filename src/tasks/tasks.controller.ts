import {
  Controller,
  Res,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.findAll(filterDto, user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.findOne(id, user);
  }

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get('file/:name')
  getFile(@Param('name') name: string, @Res() res: Response): void {
    res.sendFile(name, { root: process.env.UPLOAD_FILE_PATH });
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): Express.Multer.File {
    return file;
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 3))
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Express.Multer.File[] {
    return files;
  }

  @Post('files/fields')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar' }, { name: 'background' }]),
  )
  uploadFilesByFields(
    @UploadedFiles()
    files: {
      avatar: Express.Multer.File[];
      background: Express.Multer.File[];
    },
  ): { avatar: Express.Multer.File[]; background: Express.Multer.File[] } {
    return files;
  }

  @Post('files/any')
  @UseInterceptors(AnyFilesInterceptor())
  uploadAnyFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Express.Multer.File[] {
    return files;
  }

  @Patch(':id/status')
  @Roles('admin')
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { status: { type: 'string', example: TaskStatus.DONE } },
    },
  })
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', example: 1 })
  @HttpCode(204)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.delete(id, user);
  }
}
