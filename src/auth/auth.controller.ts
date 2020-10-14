import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Query,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GetUser } from './decorators/get-user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LineGuard } from './guards/line.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('signup')
  @ApiConflictResponse()
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<void> {
    const id = await this.authService.signUp(authCredentialsDto);
    this.setCookieAndResponseJWT(res, id);
  }

  @Post('signin')
  @ApiBody({ type: AuthCredentialsDto })
  @UseGuards(AuthGuard('local'))
  @ApiUnauthorizedResponse()
  signIn(@GetUser('id') id: number, @Res() res: Response): void {
    this.setCookieAndResponseJWT(res, id);
  }

  @Get('verify')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse()
  verify(@GetUser('id') id: number, @Res() res: Response): void {
    this.setCookieAndResponseJWT(res, id);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiQuery({ name: 'access_token', type: 'string' })
  @ApiConflictResponse()
  @ApiUnauthorizedResponse()
  signInWithFacebook(@GetUser('id') id: number, @Res() res: Response): void {
    this.setCookieAndResponseJWT(res, id);
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
    this.setCookieAndResponseJWT(res, id);
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
    this.setCookieAndResponseJWT(res, id, process.env.WEB_HOST);
  }

  @Get('reset')
  @ApiQuery({ name: 'email', type: 'string' })
  async requestResetPassword(@Query('email') email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException('email should not be empty');
    }
    await this.authService.requestResetPassword(email);
  }

  @Post('reset')
  @ApiQuery({ name: 'token', type: 'string' })
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    if (!token) {
      throw new BadRequestException('token should not be empty');
    }
    await this.authService.resetPassword(token, resetPasswordDto.password);
  }

  private setCookieAndResponseJWT(res: Response, id: number, redirectURL?: string): void {
    const payload: JwtPayload = { id };
    const token = this.jwtService.sign(payload);
    res.cookie('token', token, {
      maxAge: +process.env.JWT_EXPIRES_IN,
      httpOnly: true,
    });
    if (redirectURL) {
      res.redirect(redirectURL);
    } else {
      res.status(HttpStatus.OK).json({ token });
    }
  }
}
