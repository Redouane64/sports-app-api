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
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User implements Omit<AuthenticatedUser, 'sessionId'> {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Exclude()
  @Column('varchar', { nullable: false })
  @Index({ unique: true })
  email!: string;

  @ApiProperty()
  @Column('varchar', { name: 'full_name' })
  fullName!: string;

  @Exclude()
  @Column('varchar', { select: false })
  password!: string;

  @Exclude()
  @OneToMany(() => Session, (session) => session.user, {
    eager: false,
    cascade: true,
    nullable: true,
  })
  sessions?: Session[];

  @Exclude()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt!: Date;
}
