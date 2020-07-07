import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@ApiCookieAuth()
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  find(@GetUser('id') id: number): Promise<User> {
    return this.usersService.find(id);
  }
}
