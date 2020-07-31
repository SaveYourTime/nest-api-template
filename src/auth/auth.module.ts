import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../users/user.repository';
import { ProviderRepository } from 'src/providers/provider.repository';
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
      secret: process.env.JWT_SECRET_KEY ?? 'my_secret_key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '3600000' },
    }),
    HttpModule,
  ],
  exports: [
    PassportModule,
    JwtStrategy,
    FacebookStrategy,
    FacebookConnectStrategy,
    GoogleStrategy,
    GoogleConnectStrategy,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    FacebookStrategy,
    FacebookConnectStrategy,
    GoogleStrategy,
    GoogleConnectStrategy,
  ],
})
export class AuthModule {}
