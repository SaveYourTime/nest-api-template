import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Task } from '../../tasks/task.entity';
import { TaskStatus } from '../../tasks/task-status.enum';

interface Context {
  id: number;
}

define(Task, (faker: typeof Faker, context: Context) => {
  const { id } = context;

  faker.locale = 'zh_TW';
  const title = faker.lorem.words();
  const description = faker.lorem.paragraph();
  const status = faker.random.objectElement<TaskStatus>(TaskStatus);

  const task = new Task();
  task.title = title;
  task.description = description;
  task.status = status;
  task.userId = id;
  return task;
});
