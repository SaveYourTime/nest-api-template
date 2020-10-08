import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { uploadToS3 } from '../utils/uploadToS3';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  find(): Promise<User[]> {
    return this.userRepository.find({
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          provider: 'user.providers',
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

  async uploadAvatar(id: number, file: Express.Multer.File): Promise<User> {
    const { Location } = await uploadToS3(file);
    return this.userRepository.updateAvatar(id, Location);
  }
}
