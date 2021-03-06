import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import * as Strategy from 'passport-facebook-token';
import { AuthRepository } from '../auth.repository';
import { UserRepository } from '../../users/user.repository';
import { ProviderType } from '../../providers/provider-type.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authRepository: AuthRepository, private userRepository: UserRepository) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      fbGraphVersion: 'v7.0',
    } as Strategy.StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<void> {
    const { id } = profile;

    let user = await this.userRepository.findUserByProvider(id, ProviderType.FACEBOOK);
    if (user) {
      return done(null, user);
    }

    try {
      user = await this.authRepository.signUpWithThirdPartyProvider(profile);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
