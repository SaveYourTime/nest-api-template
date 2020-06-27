import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('providers')
@UseGuards(AuthGuard())
export class ProvidersController {}
