import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository, Connection } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from 'passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Auth } from './auth.entity';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { RoleType } from '../roles/role.enum';
import { Provider } from '../providers/provider.entity';
import { ProviderType } from '../providers/provider-type.enum';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  constructor(private connection: Connection) {
    super();
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<number> {
    const { username, password } = authCredentialsDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await this.connection.getRepository(Role).findOneOrFail({ name: RoleType.USER });

    const auth = new Auth();
    auth.username = username;
    auth.password = hashedPassword;

    const user = new User();
    user.email = username;
    user.auth = auth;
    user.roles = [role];

    try {
      await user.save();
      return user.id;
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const auth = await this.createQueryBuilder('auth')
      .innerJoinAndSelect('auth.user', 'user')
      .where('auth.username = :username', { username })
      .getOne();
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }

    const valid = await auth.validatePassword(password);
    if (auth && valid) {
      return auth.user;
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
    const role = await this.connection.getRepository(Role).findOneOrFail({ name: RoleType.USER });

    const auth = new Auth();
    auth.username = email;

    const provider = new Provider();
    provider.providerId = id;
    provider.type = ProviderType[type.toUpperCase()];

    const user = new User();
    user.email = email;
    user.firstName = familyName;
    user.lastName = givenName;
    user.photo = photo;
    user.auth = auth;
    user.provider = [...(user.provider ?? []), provider];
    user.roles = [role];

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

  async requestResetPassword(email: string, token: string): Promise<void> {
    const auth = await this.findOne({ username: email });
    if (!auth) {
      throw new NotFoundException('User not found');
    }

    auth.resetToken = token;
    await auth.save();
  }

  async resetPassword(email: string, token: string, password: string): Promise<void> {
    const auth = await this.findOne({ username: email });

    if (!auth) {
      throw new NotFoundException('User not found');
    }
    if (!auth.resetToken) {
      throw new NotFoundException('Token not found');
    }
    if (auth.resetToken !== token) {
      throw new BadRequestException('Token mismatched, please use the latest one');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    auth.password = hashedPassword;
    auth.resetToken = null;
    await auth.save();
  }
}
