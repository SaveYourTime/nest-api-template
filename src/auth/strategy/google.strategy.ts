import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthRepository } from '../auth.repository';
import { UserRepository } from '../../users/user.repository';
import { User } from '../../users/user.entity';
import { ProviderType } from '../../providers/provider-type.enum';

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
    const { id } = profile;

    let user = await this.userRepository.findUserByProvider(
      id,
      ProviderType.GOOGLE,
    );
    if (user) {
      return user;
    }

    user = await this.authRepository.signUpWithThirdPartyProvider(profile);
    return user;
  }
}
