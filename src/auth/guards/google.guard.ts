import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { google } from 'googleapis';
import { AuthRepository } from '../auth.repository';
import { UserRepository } from '../../users/user.repository';
import { ProviderType } from '../../providers/provider-type.enum';

// We authenticate with lower level google api here instead of using passport-google-oauth20
// Due to the lack of passport-oauth2 supported, when authenticate user's token from google
// passing 'postmessage' as redirect_uri is needed. When passing 'postmessage' to passport-oauth2,
// it consider 'postmessage' as the relative uri, so the library will add the prefix with server origin.
// Would be something like 'http://localhost:3000/postmessage', that's not what we want!
// I have already made the pull request: https://github.com/jaredhanson/passport-oauth2/pull/126
@Injectable()
export class GoogleGuard implements CanActivate {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { code } = request.query;
    if (!code) return false;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );
    try {
      const { tokens } = await oauth2Client.getToken(`${code}`);
      if (!tokens) return false;
      oauth2Client.setCredentials(tokens);
    } catch (error) {
      return false;
    }

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });
    const { data } = await oauth2.userinfo.get();
    if (!data) return false;

    const { id, name, family_name, given_name, email, picture } = data;

    let user = await this.userRepository.findUserByProvider(
      id,
      ProviderType.GOOGLE,
    );
    if (user) {
      request.user = user;
      return true;
    }

    const profile = {
      provider: 'google',
      id,
      displayName: name,
      username: name,
      name: {
        familyName: family_name,
        givenName: given_name,
      },
      emails: [{ value: email }],
      photos: [{ value: picture }],
    };
    user = await this.authRepository.signUpWithThirdPartyProvider(profile);
    if (user) {
      request.user = user;
      return true;
    }
    return false;
  }
}
