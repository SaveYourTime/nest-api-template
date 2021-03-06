import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  find(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.findAll(filterDto, user);
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) throw new NotFoundException(`Task with ID: '${id}' not found.`);
    return task;
  }

  create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async delete(id: number, user: User): Promise<void> {
    await this.taskRepository.softDelete({ id, userId: user.id });
  }
}
