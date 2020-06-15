import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async findAll(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.findAll(filterDto);
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) throw new NotFoundException(`Task with ID: '${id}' not found.`);
    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    task.status = status;
    await task.save();
    return task;
  }

  async delete(id: number): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);
    if (!affected)
      throw new NotFoundException(`Task with ID: '${id}' not found.`);
  }
}
