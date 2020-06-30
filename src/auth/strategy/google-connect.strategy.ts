import { Injectable, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile } from 'passport';
import {
  Strategy,
  StrategyOptionsWithRequest,
  VerifyCallback,
} from 'passport-google-oauth20';
import { UserRepository } from '../../users/user.repository';
import { ProviderRepository } from '../../providers/provider.repository';
import { ProviderType } from '../../providers/provider-type.enum';
import { User } from '../../users/user.entity';

@Injectable()
export class GoogleConnectStrategy extends PassportStrategy(
  Strategy,
  'google-connect',
) {
  constructor(
    private userRepository: UserRepository,
    private providerRepository: ProviderRepository,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const user = req.user as User;
    if (!user) {
      done(new ForbiddenException('User not found'));
    }

    const { id } = profile;

    const providerUser = await this.userRepository.findUserByProvider(
      id,
      ProviderType.GOOGLE,
    );
    if (providerUser) {
      if (providerUser.id === user.id) {
        return done(null, user);
      }
      return done(
        new ForbiddenException(
          'User already connected to this google with another acoount',
        ),
      );
    }

    try {
      await this.providerRepository.createProviderByUserId(
        id,
        ProviderType.GOOGLE,
        user.id,
      );
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
