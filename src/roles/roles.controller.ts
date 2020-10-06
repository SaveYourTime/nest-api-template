import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';

@ApiBearerAuth()
@ApiCookieAuth()
@UseGuards(AuthGuard())
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
}
