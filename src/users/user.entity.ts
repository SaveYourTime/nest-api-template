import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Auth } from '../auth/auth.entity';
import { Task } from '../tasks/task.entity';
import { Role } from '../roles/role.entity';
import { Provider } from '../providers/provider.entity';
import { Gender } from './gender.enum';
import { Marriage } from './marriage.enum';
import { Education } from './education.enum';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  nickName?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  occupation?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: Marriage, nullable: true })
  marriage?: Marriage;

  @Column({ type: 'enum', enum: Education, nullable: true })
  education?: Education;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne((type) => Auth, (auth) => auth.user, { cascade: true })
  auth: Auth;

  @OneToMany((type) => Provider, (provider) => provider.user, { cascade: true })
  providers: Provider[];

  @OneToMany((type) => Task, (task) => task.user, { eager: false })
  tasks: Task[];

  @ManyToMany((type) => Role, (role) => role.users, {
    nullable: false,
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @Expose()
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.lastName} ${this.firstName}`;
    }
    return this.firstName || this.lastName;
  }

  @Expose()
  get age(): number {
    if (!this.dateOfBirth) return null;
    return new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
  }
}
