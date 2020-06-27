import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { ProviderType } from './provider-type.enum';

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

  @ManyToOne((type) => User, (user) => user.id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column()
  userId: number;
}
