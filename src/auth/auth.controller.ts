import { Controller, Get, Post, Res, Body, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './decorators/get-user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LineGuard } from './guards/line.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('signup')
  @ApiConflictResponse()
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  @ApiUnauthorizedResponse()
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<void> {
    const token = await this.authService.signIn(authCredentialsDto);
    this.setResponseJWTCookie(res, token);
    res.status(HttpStatus.OK).json({ token });
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiQuery({ name: 'access_token', type: 'string' })
  @ApiConflictResponse()
  @ApiUnauthorizedResponse()
  signInWithFacebook(@GetUser('id') id: number, @Res() res: Response): void {
    const payload: JwtPayload = { id };
    const token = this.jwtService.sign(payload);
    this.setResponseJWTCookie(res, token);
    res.status(HttpStatus.OK).json({ token });
  }

  @Get('facebook/connect')
  @UseGuards(AuthGuard('jwt'), AuthGuard('facebook-connect'))
  @ApiQuery({ name: 'access_token', type: 'string' })
  @ApiForbiddenResponse()
  connectFacebookAccount(): void {
    return null;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiQuery({ name: 'access_token', type: 'string' })
  @ApiConflictResponse()
  @ApiUnauthorizedResponse()
  signInWithGoogle(@GetUser('id') id: number, @Res() res: Response): void {
    const payload: JwtPayload = { id };
    const token = this.jwtService.sign(payload);
    this.setResponseJWTCookie(res, token);
    res.status(HttpStatus.OK).json({ token });
  }

  @Get('google/connect')
  @UseGuards(AuthGuard('jwt'), AuthGuard('google-connect'))
  @ApiQuery({ name: 'access_token', type: 'string' })
  @ApiForbiddenResponse()
  connectGoogleAccount(): void {
    return null;
  }

  @Get('line')
  @UseGuards(LineGuard)
  @ApiQuery({ name: 'code', type: 'string' })
  @ApiForbiddenResponse()
  signInWithLine(@GetUser('id') id: number, @Res() res: Response): void {
    const payload: JwtPayload = { id };
    const token = this.jwtService.sign(payload);
    this.setResponseJWTCookie(res, token);
    res.redirect(process.env.WEB_HOST);
  }

  private setResponseJWTCookie(res: Response, token: string): void {
    res.cookie('token', token, {
      maxAge: +process.env.JWT_EXPIRES_IN,
      httpOnly: true,
    });
  }
}
