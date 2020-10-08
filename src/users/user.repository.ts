import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { User } from './user.entity';
import { ProviderType } from '../providers/provider-type.enum';
import { UserProfileDto } from './dto/user-profile.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUserByProvider(id: string, type: ProviderType): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .innerJoinAndSelect('user.providers', 'provider')
      .where('provider.providerId = :id', { id })
      .andWhere('provider.type = :type', { type })
      .getOne();
    return user;
  }

  async findUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Can not find user with ID: ${id}`);
    }
    return user;
  }

  async updateProfile(id: number, userProfileDto: UserProfileDto): Promise<User> {
    if (userProfileDto.dateOfBirth) {
      userProfileDto.dateOfBirth = dayjs(userProfileDto.dateOfBirth).format('YYYY-MM-DD');
    }
    try {
      await this.update(id, userProfileDto);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const user = await this.findUser(id);
    return user;
  }

  async updateAvatar(id: number, photo: string): Promise<User> {
    await this.update(id, { photo });

    const user = await this.findUser(id);
    return user;
  }
}
