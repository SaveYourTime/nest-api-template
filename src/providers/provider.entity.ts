import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderType } from './provider-type.enum';
import { User } from '../users/user.entity';

@Entity()
@Unique(['providerId', 'type'])
export class Provider extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  providerId: string;

  @ApiProperty({
    type: 'enum',
    enum: ProviderType,
    description: 'The type of the provider',
  })
  @Column({ type: 'enum', enum: ProviderType })
  type: ProviderType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((type) => User, (user) => user.providers, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  userId: number;
}
