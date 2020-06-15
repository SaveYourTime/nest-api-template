import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<void> {
    const token = await this.authService.signIn(authCredentialsDto);
    res.cookie('token', token, {
      maxAge: +process.env.JWT_EXPIRES_IN,
      httpOnly: true,
    });
    res.status(HttpStatus.OK).json({ token });
  }
}
