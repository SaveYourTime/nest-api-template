import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from './role.enum';
import { User } from '../users/user.entity';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: 'enum',
    enum: RoleType,
    description: 'The role of the user',
  })
  @Column({ type: 'enum', enum: RoleType })
  name: RoleType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany((type) => User, (user) => user.role)
  users: User[];
}
