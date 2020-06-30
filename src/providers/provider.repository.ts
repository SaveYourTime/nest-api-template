import { EntityRepository, Repository } from 'typeorm';
import { Provider } from './provider.entity';
import { ProviderType } from './provider-type.enum';

@EntityRepository(Provider)
export class ProviderRepository extends Repository<Provider> {
  async createProviderByUserId(
    id: string,
    type: ProviderType,
    userId: number,
  ): Promise<Provider> {
    const provider = new Provider();
    provider.providerId = id;
    provider.type = type;
    provider.userId = userId;

    await provider.save();

    return provider;
  }
}
