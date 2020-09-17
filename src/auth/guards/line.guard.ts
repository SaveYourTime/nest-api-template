import { Injectable, CanActivate, ExecutionContext, HttpService } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { Request, Response } from 'express';
import { AuthRepository } from '../auth.repository';
import { UserRepository } from '../../users/user.repository';
import { ProviderType } from '../../providers/provider-type.enum';
import { LineToken } from '../interfaces/line-token.interface';

@Injectable()
export class LineGuard implements CanActivate {
  private axios: AxiosInstance;
  private code: string;
  private token: LineToken;
  private id: string;
  private name: string;
  private email: string;
  private picture: string;

  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    httpService: HttpService,
  ) {
    this.axios = httpService.axiosRef;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const { code } = request.query;
    if (!code) {
      this.redirectToErrorPage(response);
      return false;
    }
    this.code = code as string;

    try {
      await this.issueToken();
      await this.verifyToken();
      await this.getUserProfile();
    } catch (error) {
      this.redirectToErrorPage(response);
      return false;
    }

    let user = await this.userRepository.findUserByProvider(this.id, ProviderType.LINE);
    if (user) {
      request.user = user;
      return true;
    }

    const profile = {
      provider: 'line',
      id: this.id,
      displayName: this.name,
      username: this.name,
      name: {
        familyName: null,
        givenName: this.name,
      },
      emails: [{ value: this.email }],
      photos: [{ value: this.picture }],
    };
    try {
      user = await this.authRepository.signUpWithThirdPartyProvider(profile);
      request.user = user;
      return true;
    } catch (error) {
      this.redirectToErrorPage(response);
      return false;
    }
  }

  private async issueToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', this.code);
    params.append('redirect_uri', process.env.LINE_REDIRECT_URI);
    params.append('client_id', process.env.LINE_CLIENT_ID);
    params.append('client_secret', process.env.LINE_CLIENT_SECRET);

    const response = await this.axios.post('https://api.line.me/oauth2/v2.1/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    this.token = response.data;
  }

  private async verifyToken() {
    const params = new URLSearchParams();
    params.append('id_token', this.token.id_token);
    params.append('client_id', process.env.LINE_CLIENT_ID);

    const response = await this.axios.post('https://api.line.me/oauth2/v2.1/verify', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { name, email, picture } = response.data;
    if (!email) throw new Error();
    this.name = name;
    this.email = email;
    this.picture = picture;
  }

  private async getUserProfile() {
    const response = await this.axios.get('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${this.token.access_token}` },
    });
    this.id = response.data.userId;
  }

  private redirectToErrorPage(response: Response) {
    response.redirect(`${process.env.WEB_HOST}/error`);
  }
}
