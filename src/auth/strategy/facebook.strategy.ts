import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-facebook';
import { AuthRepository } from '../auth.repository';
import { User } from '../../users/user.entity';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authRepository: AuthRepository) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_APP_CALLBACK,
      scope: ['email'],
      profileFields: [
        'id',
        'displayName',
        'name',
        'profileUrl',
        'emails',
        'photos',
      ],
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

    let user = await this.authRepository.findOne({ facebookId: id });
    if (user) {
      return user;
    }

    user = await this.authRepository.findOne({ email });
    if (user) {
      user.facebookId = id;
      await user.save();
      return user;
    }

    user = await this.authRepository.signUpWithFacebook(profile);
    return user;
  }
}
