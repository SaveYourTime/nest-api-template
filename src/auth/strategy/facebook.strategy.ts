import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthRepository } from '../auth.repository';
import { User } from '../../users/user.entity';
import { Gender } from '../../users/gender.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
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
        'gender',
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
  ): Promise<any> {
    const {
      id,
      gender,
      name: { familyName, givenName },
      emails: [{ value: email }],
      photos: [{ value: photo }],
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

    user = new User();
    user.facebookId = id;
    user.email = email;
    user.username = email;
    user.firstName = familyName;
    user.lastName = givenName;
    user.gender = gender === 'male' ? Gender.MALE : Gender.FEMALE;
    user.photo = photo;
    await user.save();
    return user;
  }
}
