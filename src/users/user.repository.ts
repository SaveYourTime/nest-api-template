import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { ProviderType } from '../providers/provider-type.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUserByProvider(id: string, type: ProviderType): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .innerJoinAndSelect('user.provider', 'provider')
      .where('provider.providerId = :id', { id })
      .andWhere('provider.type = :type', { type })
      .getOne();
    return user;
  }
}
