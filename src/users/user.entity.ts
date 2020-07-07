import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Auth } from '../auth/auth.entity';
import { Task } from '../tasks/task.entity';
import { Provider } from '../providers/provider.entity';
import { Gender } from './gender.enum';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  photo?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne((type) => Auth, (auth) => auth.user, { cascade: true })
  auth: Auth;

  @OneToMany((type) => Provider, (provider) => provider.user, { cascade: true })
  provider: Provider[];

  @OneToMany((type) => Task, (task) => task.user, { eager: false })
  task: Task[];

  @Expose()
  get fullName(): string {
    if (!this.firstName || !this.lastName) return null;
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get age(): number {
    if (!this.dateOfBirth) return null;
    return new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
  }
}
