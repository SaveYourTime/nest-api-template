import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
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
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id } = profile;

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
      // We pass an empty object here, to prevent passport automatically throw an UnauthorizedException for us
      // We are going to handle this exception by ourself in AuthController
      done(null, {});
    }
  }
}
