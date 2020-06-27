import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthRepository } from '../auth.repository';
import { UserRepository } from '../../users/user.repository';
import { User } from '../../users/user.entity';
import { Provider } from '../../providers/provider.entity';
import { ProviderType } from 'src/providers/provider-type.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
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
      .andWhere('provider.type = :type', { type: ProviderType.GOOGLE })
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
      // User already have an account with the same email they use to login google
      // Current: Attach the google id to the existing account, it might cause some security issue
      // Solution: Ask user to login with the account they created before, and help them to connect
      const provider = new Provider();
      provider.type = ProviderType.GOOGLE;
      provider.providerId = id;
      user.provider = [...(user.provider ?? []), provider];
      await user.save();
      return user;
    }

    user = await this.authRepository.signUpWithThirdPartyProvider(profile);
    if (user) {
      return user;
    }

    throw new UnauthorizedException('Failed to login or signup with google');
  }
}
