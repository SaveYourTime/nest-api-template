import { Factory, Seeder } from 'typeorm-seeding';
import { Auth } from '../../auth/auth.entity';
import { User } from '../../users/user.entity';
import { Task } from '../../tasks/task.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const users = await factory(User)().createMany(10);

    for (const user of users) {
      const { id } = user;

      await factory(Auth)({ id }).create();
      await factory(Task)({ id }).create();
    }
  }
}
