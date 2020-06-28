import {
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from 'passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Auth } from './auth.entity';
import { User } from '../users/user.entity';
import { Provider } from '../providers/provider.entity';
import { ProviderType } from '../providers/provider-type.enum';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const auth = new Auth();
    auth.username = username;
    auth.password = hashedPassword;

    const user = new User();
    user.email = username;
    user.auth = auth;

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
      return user.userId;
    }

    throw new UnauthorizedException('Password incorrect');
  }

  async signUpWithThirdPartyProvider(profile: Profile): Promise<User> {
    const {
      id,
      provider: type,
      name: { familyName, givenName },
      emails: [{ value: email }],
      photos: [{ value: photo }],
    } = profile;

    const auth = new Auth();
    auth.username = email;

    const provider = new Provider();
    provider.providerId = id;
    if (type === 'facebook') {
      provider.type = ProviderType.FACEBOOK;
    } else if (type === 'google') {
      provider.type = ProviderType.GOOGLE;
    }

    const user = new User();
    user.email = email;
    user.firstName = familyName;
    user.lastName = givenName;
    user.photo = photo;
    user.auth = auth;
    user.provider = [...(user.provider ?? []), provider];

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('User already exists');
      } else {
        throw new UnauthorizedException(`Failed to login with ${type}`);
      }
    }
  }
}
