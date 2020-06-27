import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import * as Strategy from 'passport-facebook-token';
import { AuthRepository } from '../auth.repository';
import { UserRepository } from '../../users/user.repository';
import { User } from '../../users/user.entity';
import { Provider } from '../../providers/provider.entity';
import { ProviderType } from 'src/providers/provider-type.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      fbGraphVersion: 'v7.0',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const {
      id,
      emails: [{ value: email }],
    } = profile;

    let user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.provider', 'provider')
      .where('provider.providerId = :id', { id })
      .andWhere('provider.type = :type', { type: ProviderType.FACEBOOK })
      .getOne();
    if (user) {
      return user;
    }

    user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.auth', 'auth')
      .where('auth.username = :email', { email })
      .getOne();
    if (user) {
      // TODO:
      // User already have an account with the same email they use to login facebook
      // Current: Attach the facebook id to the existing account, it might cause some security issue
      // Solution: Ask user to login with the account they created before, and help them to connect
      const provider = new Provider();
      provider.type = ProviderType.FACEBOOK;
      provider.providerId = id;
      user.provider = [...(user.provider ?? []), provider];
      await user.save();
      return user;
    }

    user = await this.authRepository.signUpWithThirdPartyProvider(profile);
    if (user) {
      return user;
    }

    throw new UnauthorizedException('Failed to login or signup with facebook');
  }
}
