import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWtihFilter(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) throw new NotFoundException(`Task with ID: '${id}' not found.`);
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  // updateTaskStatus(id: number, status: TaskStatus): Task {
  //   const task: Task = this.getTaskById(id);
  //   if (task) {
  //     task.status = status;
  //   }
  //   return task;
  // }

  async delete(id: number): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);
    if (!affected)
      throw new NotFoundException(`Task with ID: '${id}' not found.`);
  }
}
