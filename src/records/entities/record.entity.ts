import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineStringZ',
    srid: 4326,
  })
  route!: object;

  @Column('jsonb')
  timestamps!: Date[];

  @Column('uuid', { name: 'author_id' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column('uuid', { name: 'track_id' })
  trackId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track!: User;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt!: Date;
}
