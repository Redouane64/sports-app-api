import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  type LineString,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { RecordStatus } from '../dtos/record-status.dto';
import { Track } from 'src/track/entities/track.entity';
import { Exclude } from 'class-transformer';

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
  route!: LineString;

  @Column('int', { nullable: true, name: 'total_time' })
  totalTime?: number;

  @VirtualColumn({
    query: (alias) => `
      st_3dlength(st_transform(${alias}.route, 32633))
    `,
  })
  totalDistance!: number;

  @Exclude()
  @Column('uuid', { name: 'author_id' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Exclude()
  @Column('uuid', { name: 'track_id' })
  trackId!: string;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track!: Track;

  @Exclude()
  @Column('double precision', { name: 'similarity_score', nullable: true })
  similarityScore?: number;

  @Column('varchar', { default: RecordStatus.DRAFT })
  status!: RecordStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt!: Date;
}
