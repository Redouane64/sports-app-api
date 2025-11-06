import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecordStatus } from '../dtos/record-status.dto';
import { Track } from 'src/track/entities/track.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineStringZ',
    srid: 4326,
    // data may be too large, therefore we let the client decided
    // when to select them as needed
    select: false,
  })
  route!: object;

  @Column('jsonb', {
    // data may be too large, therefore we let the client decided
    // when to select them as needed
    select: false,
  })
  timestamps!: Date[];

  @Column('uuid', { name: 'author_id' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column('uuid', { name: 'track_id' })
  trackId!: string;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track!: Track;

  @Column('varchar', { default: RecordStatus.DRAFT })
  status!: RecordStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt!: Date;
}
