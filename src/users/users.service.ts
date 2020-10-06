import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async find(): Promise<User[]> {
    return await this.userRepository.find({
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          provider: 'user.provider',
        },
      },
    });
  }

  async findMine(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async updateProfile(id: number, userProfileDto: UserProfileDto): Promise<User> {
    return await this.userRepository.updateProfile(id, userProfileDto);
  }

  async uploadAvatar(id: number, file: Express.Multer.File): Promise<User> {
    // Upload avatar to cloud storage
    return await this.userRepository.updateAvatar(id, file.filename);
  }
}
