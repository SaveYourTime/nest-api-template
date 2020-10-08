import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { User } from '../users/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { mailer } from '../utils/mailer';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository, private jwtService: JwtService) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<number> {
    return this.authRepository.signUp(authCredentialsDto);
  }

  signIn(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authRepository.signIn(authCredentialsDto);
  }

  async requestResetPassword(email: string): Promise<any> {
    const token = this.jwtService.sign({ email }, { expiresIn: '1d' });
    await this.authRepository.requestResetPassword(email, token);

    const resetLink = `${process.env.WEB_HOST}/reset?token=${token}`;
    try {
      await mailer({
        to: [email],
        subject: 'Reset your Password',
        content: `
          1. 請確認您的信箱帳號：${email}<br />
          2. 點此連結『<a href="${resetLink}">Reset Password</a>』完成密碼重設。<br />
          3. 如果您無法點開連結，請複製此網址完成密碼重設<br />
          ${resetLink}`,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Can not send reset password link to ${email}`);
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      await this.authRepository.resetPassword(payload.email, token, password);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token has expired');
      }
      throw error;
    }
  }
}
