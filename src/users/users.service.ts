import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  async find(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
