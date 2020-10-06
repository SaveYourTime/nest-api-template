import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from '../../roles/role.entity';
import { RoleType } from '../../roles/role.enum';
import { roles } from '../../constants/roles';

export default class CreateRole implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const exist = await connection
      .createQueryBuilder<Role>(Role, 'r')
      .where('r.name IN (:roles)', { roles })
      .getCount();

    if (!exist) {
      for (const category of roles) {
        await factory<Role, RoleType>(Role)(category).create();
      }
    }
  }
}
