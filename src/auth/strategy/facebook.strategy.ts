import { Injectable } from '@nestjs/common';
import { use, Profile } from 'passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class FacebookStrategy {
  constructor(private authRepository: AuthRepository) {
    use(
      new FacebookTokenStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          fbGraphVersion: 'v7.0',
        },
        this.validate.bind(this),
      ),
    );
  }

  private async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<void> {
    const {
      id,
      emails: [{ value: email }],
    } = profile;

    let user = await this.authRepository.findOne({ facebookId: id });
    if (user) {
      return done(null, user);
    }

    user = await this.authRepository.findOne({ email });
    if (user) {
      user.facebookId = id;
      await user.save();
      return done(null, user);
    }

    user = await this.authRepository.signUpWithFacebook(profile);
    if (user) {
      return done(null, user);
    }

    return done('Failed to login or signup with facebook');
  }
}
