import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [];

  getAllTasks(): any[] {
    return this.tasks;
  }
}
