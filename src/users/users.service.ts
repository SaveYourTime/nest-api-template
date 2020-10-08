import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  find(): Promise<User[]> {
    return this.userRepository.find({
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          provider: 'user.provider',
        },
      },
    });
  }

  findMine(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  update(id: number, userProfileDto: UserProfileDto): Promise<User> {
    return this.userRepository.updateProfile(id, userProfileDto);
  }

  uploadAvatar(id: number, file: Express.Multer.File): Promise<User> {
    // Upload avatar to cloud storage
    return this.userRepository.updateAvatar(id, file.filename);
  }
}
