import {
  Controller,
  UseGuards,
  UsePipes,
  UseInterceptors,
  ValidationPipe,
  Get,
  Post,
  Patch,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCookieAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserProfileDto } from './dto/user-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../roles/role.enum';

@ApiBearerAuth()
@ApiCookieAuth()
@UseGuards(AuthGuard())
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  findMine(@GetUser('id') id: number): Promise<User> {
    return this.usersService.findMine(id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(
    @GetUser('id') id: number,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(id, userProfileDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  uploadAvatar(
    @GetUser('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.uploadAvatar(id, file);
  }
}
