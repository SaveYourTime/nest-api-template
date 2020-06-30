import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { JwtPayload } from './jwt-payload.interface';
import { GoogleGuard } from './google.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

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
    this.setResponseJWTCookie(res, token);
    res.status(HttpStatus.OK).json({ token });
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  signInWithFacebook(@GetUser('id') id: number, @Res() res: Response): void {
    const payload: JwtPayload = { id };
    const token = this.jwtService.sign(payload);
    this.setResponseJWTCookie(res, token);
    res.status(HttpStatus.OK).json({ token });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  signInWithGoogle(@GetUser('id') id: number, @Res() res: Response): void {
    if (!id) {
      return res.redirect(`${process.env.WEB_URL}/error`);
    }
    const payload: JwtPayload = { id };
    const token = this.jwtService.sign(payload);
    this.setResponseJWTCookie(res, token);
    res.redirect(process.env.WEB_URL);
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  async code(@GetUser('id') id: number, @Res() res: Response): Promise<void> {
    const payload: JwtPayload = { id };
    const token = this.jwtService.sign(payload);
    this.setResponseJWTCookie(res, token);
    res.status(HttpStatus.OK).json({ token });
  }

  private setResponseJWTCookie(res: Response, token: string): void {
    res.cookie('token', token, {
      maxAge: +process.env.JWT_EXPIRES_IN,
      httpOnly: true,
    });
  }
}
