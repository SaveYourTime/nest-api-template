import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../users/user.entity';
import { Gender } from '../../users/gender.enum';

define(User, (faker: typeof Faker) => {
  faker.locale = 'zh_TW';
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.exampleEmail(firstName, lastName);
  const phone = faker.phone.phoneNumber();
  const address = faker.address.streetAddress();
  const dateOfBirth = faker.date.past();
  const gender = faker.random.objectElement<Gender>(Gender);

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.gender = gender;
  user.email = email;
  user.phone = phone;
  user.address = address;
  user.dateOfBirth = dateOfBirth;
  return user;
});
