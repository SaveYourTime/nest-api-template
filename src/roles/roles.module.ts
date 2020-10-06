import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleRepository } from './role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
