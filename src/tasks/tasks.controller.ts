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
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
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
import { RoleType } from '../roles/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiCookieAuth()
@UseGuards(AuthGuard())
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  find(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    return this.tasksService.find(filterDto, user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.findOne(id, user);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Patch(':id/status')
  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { status: { type: 'string', example: TaskStatus.DONE } },
    },
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @ApiParam({ name: 'id', example: 1 })
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.tasksService.delete(id, user);
  }

  @Get('file/:name')
  getFile(@Param('name') name: string, @Res() res: Response): void {
    res.sendFile(name, { root: process.env.UPLOAD_FILE_PATH });
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File): Express.Multer.File {
    return file;
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { files: { type: 'string', format: 'binary' } },
    },
  })
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Express.Multer.File[] {
    return files;
  }

  @Post('files/fields')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar' }, { name: 'background' }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' },
        background: { type: 'string', format: 'binary' },
      },
    },
  })
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        foo: { type: 'string', format: 'binary' },
        bar: { type: 'string', format: 'binary' },
      },
    },
  })
  uploadAnyFiles(@UploadedFiles() files: Express.Multer.File[]): Express.Multer.File[] {
    return files;
  }
}
