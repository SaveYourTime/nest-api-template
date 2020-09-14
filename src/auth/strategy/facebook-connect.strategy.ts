import { Injectable, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile } from 'passport';
import * as Strategy from 'passport-facebook-token';
import { UserRepository } from '../../users/user.repository';
import { ProviderRepository } from '../../providers/provider.repository';
import { ProviderType } from '../../providers/provider-type.enum';
import { User } from '../../users/user.entity';

@Injectable()
export class FacebookConnectStrategy extends PassportStrategy(Strategy, 'facebook-connect') {
  constructor(
    private userRepository: UserRepository,
    private providerRepository: ProviderRepository,
  ) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      fbGraphVersion: 'v7.0',
      passReqToCallback: true,
    } as Strategy.StrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<void> {
    const user = req.user as User;
    if (!user) {
      done(new ForbiddenException('User not found'));
    }

    const { id } = profile;

    const facebookUser = await this.userRepository.findUserByProvider(id, ProviderType.FACEBOOK);
    if (facebookUser) {
      if (facebookUser.id === user.id) {
        return done(null, user);
      }
      return done(
        new ForbiddenException('User already connected to this facebook with another acoount'),
      );
    }

    try {
      await this.providerRepository.createProviderByUserId(id, ProviderType.FACEBOOK, user.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
