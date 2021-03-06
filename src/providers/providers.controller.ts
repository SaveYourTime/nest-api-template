import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProvidersService } from './providers.service';

@ApiBearerAuth()
@ApiCookieAuth()
@UseGuards(AuthGuard())
@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}
}
