import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-token-google2';
import { AuthRepository } from '../auth.repository';
import { UserRepository } from '../../users/user.repository';
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
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile & { _json?: { picture?: string } },
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<void> {
    const { id } = profile;
    profile.photos = [{ value: profile?._json?.picture }];

    let user = await this.userRepository.findUserByProvider(
      id,
      ProviderType.GOOGLE,
    );
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
