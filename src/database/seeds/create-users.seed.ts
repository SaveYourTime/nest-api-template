import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Auth } from '../../auth/auth.entity';
import { User } from '../../users/user.entity';
import { Task } from '../../tasks/task.entity';
import { Role } from '../../roles/role.entity';
import { RoleType } from '../../roles/role.enum';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const exist = await connection.createQueryBuilder<User>(User, 'u').getCount();
    const role = await connection
      .createQueryBuilder<Role>(Role, 'r')
      .where({ name: RoleType.USER })
      .getOne();

    if (!exist) {
      const users = await factory<User, Role>(User)(role).createMany(10);

      for (const user of users) {
        const { id } = user;

        await factory(Auth)({ id }).create();
        await factory(Task)({ id }).create();
      }
    }
  }
}
