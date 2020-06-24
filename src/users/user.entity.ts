import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Gender } from './gender.enum';

@Entity()
@Unique(['username'])
@Unique(['facebookId'])
@Unique(['googleId'])
@Unique(['lineId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  lineId?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  email: string;

  @ApiProperty({
    type: 'enum',
    enum: Gender,
    default: Gender.FEMALE,
    description: 'The status of a task',
  })
  @Column({ type: 'enum', enum: Gender, default: Gender.FEMALE })
  gender: Gender;

  @Column({ nullable: true })
  photo?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
