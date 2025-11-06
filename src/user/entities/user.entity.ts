import { Session } from 'src/auth/entities/session.entity';
import { AuthenticatedUser } from '../../auth';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User implements Omit<AuthenticatedUser, 'sessionId'> {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  @Index({ unique: true })
  email!: string;

  @Column('varchar', { name: 'full_name' })
  fullName!: string;

  @Column('varchar', { select: false })
  password!: string;

  @OneToMany(() => Session, (session) => session.user, {
    eager: false,
    cascade: true,
    nullable: true,
  })
  sessions?: Session[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt!: Date;
}
