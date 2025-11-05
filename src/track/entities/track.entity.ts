import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../dtos/list-tracks-filter-params.dto';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar', { nullable: true })
  description?: string;

  @Column('geography')
  location!: Location;

  // TODO: may be upgrade to PostGIS native types
  @Column('jsonb', { default: `[]` })
  route: unknown;

  @Column('int')
  totalDistance!: number;

  @Column('uuid', { name: 'author_id' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column('boolean', { default: false })
  public!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt!: Date;
}
