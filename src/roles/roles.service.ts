import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';

@Injectable()
export class RolesService {
  constructor(private roleRepository: RoleRepository) {}
}
