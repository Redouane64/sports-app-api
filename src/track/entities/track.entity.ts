import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  type LineString,
  ManyToOne,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { GeoJsonLocation } from '../dtos/list-tracks-filter-params.dto';
import { TrackStatus } from '../interfaces';
import { Exclude } from 'class-transformer';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar', { nullable: true })
  description?: string;

  @Column('geography')
  location!: GeoJsonLocation;

  @VirtualColumn({
    query: (alias) => `
      CASE
        WHEN :enabled THEN
          ST_Distance(
              ${alias}.location::geography,
              ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
          )
        ELSE
          NULL
      END
    `,
  })
  distance?: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineStringZ',
    srid: 4326,
    // data may be too large, therefore we let the client decided
    // when to select them as needed
    select: false,
  })
  route!: LineString;

  @VirtualColumn({
    query: (alias) => `
      st_3dlength(st_transform(${alias}.route, 32633))
    `,
  })
  totalDistance!: number;

  @Column('int', { nullable: true, name: 'total_time' })
  totalTime?: number;

  @Exclude()
  @Column('uuid', { name: 'author_id' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Exclude()
  @VirtualColumn({
    query: (alias) => `${alias}.status = 'PUBLIC'`,
  })
  public!: boolean;

  @Column('varchar', { default: TrackStatus.DRAFT })
  status!: TrackStatus;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt!: Date;
}
