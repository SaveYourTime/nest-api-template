import { PipeTransform, BadRequestException } from '@nestjs/common';
import { isEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: string): any {
    if (!isEnum(value.toUpperCase(), TaskStatus)) {
      throw new BadRequestException(`${value} is not a valid status.`);
    }
    return value;
  }
}
