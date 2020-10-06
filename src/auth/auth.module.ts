import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../users/user.repository';
import { ProviderRepository } from '../providers/provider.repository';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { FacebookConnectStrategy } from './strategy/facebook-connect.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { GoogleConnectStrategy } from './strategy/google-connect.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository, UserRepository, ProviderRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    HttpModule,
  ],
  exports: [
    PassportModule,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    FacebookConnectStrategy,
    GoogleStrategy,
    GoogleConnectStrategy,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    FacebookConnectStrategy,
    GoogleStrategy,
    GoogleConnectStrategy,
  ],
})
export class AuthModule {}
