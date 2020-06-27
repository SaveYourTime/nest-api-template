import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from './task-status.enum';
import { User } from '../users/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ApiProperty({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
    description: 'The status of a task',
  })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((type) => User, (user) => user.id, {
    eager: false,
    onUpdate: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column()
  userId: number;
}
