import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
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

  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    type: 'enum',
    enum: TaskStatus,
    description: 'The status of the task',
    default: TaskStatus.OPEN,
  })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus = TaskStatus.OPEN;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((type) => User, (user) => user.tasks, {
    nullable: false,
    onUpdate: 'CASCADE',
    eager: false,
  })
  user: User;

  @Column()
  userId: number;
}
