import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Auth } from '../../auth/auth.entity';

interface Context {
  id: number;
}

define(Auth, (faker: typeof Faker, context: Context) => {
  const { id } = context;

  const username = faker.internet.exampleEmail();
  const password = faker.internet.password();

  const auth = new Auth();
  auth.username = username;
  auth.password = password;
  auth.userId = id;
  return auth;
});
