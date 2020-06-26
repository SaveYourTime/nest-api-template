import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthRepository } from '../auth.repository';
import { User } from '../../users/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authRepository: AuthRepository) {
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

    let user = await this.authRepository.findOne({ googleId: id });
    if (user) {
      return user;
    }

    user = await this.authRepository.findOne({ email });
    if (user) {
      user.googleId = id;
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
