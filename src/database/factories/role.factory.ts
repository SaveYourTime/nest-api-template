import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Role } from '../../roles/role.entity';
import { RoleType } from '../../roles/role.enum';

define(Role, (faker: typeof Faker, context: RoleType) => {
  const role = new Role();
  role.name = context;
  return role;
});
