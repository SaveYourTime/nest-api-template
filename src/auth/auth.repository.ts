import {
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from 'passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../users/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = username;
    user.username = username;
    user.password = hashedPassword;

    try {
      await user.save();
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<number> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const valid = await user.validatePassword(password);
    if (user && valid) {
      return user.id;
    }

    throw new UnauthorizedException('Password incorrect');
  }

  async signUpWithFacebook(profile: Profile): Promise<User> {
    const {
      id,
      name: { familyName, givenName },
      emails: [{ value: email }],
      photos: [{ value: photo }],
    } = profile;

    const user = new User();
    user.facebookId = id;
    user.email = email;
    user.username = email;
    user.firstName = familyName;
    user.lastName = givenName;
    user.photo = photo;
    await user.save();
    return user;
  }
}
