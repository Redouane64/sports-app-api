import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { GeoJsonLocation } from '../dtos/list-tracks-filter-params.dto';
import { TrackStatus } from '../interfaces';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LineString } from 'src/common/dtos/line-string.dto';

@Entity('tracks')
export class Track {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column('varchar')
  title!: string;

  @ApiProperty()
  @Column('varchar', { nullable: true })
  description?: string;

  @ApiProperty()
  @Column('geography')
  location!: GeoJsonLocation;

  @ApiProperty({
    nullable: true,
    description: "Track distance in meters from the user's location",
  })
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

  @ApiProperty()
  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineStringZ',
    srid: 4326,
    // data may be too large, therefore we let the client decided
    // when to select them as needed
    select: false,
  })
  route!: LineString;

  @ApiProperty()
  @VirtualColumn({
    query: (alias) => `
      st_3dlength(st_transform(${alias}.route, 32633))
    `,
  })
  totalDistance!: number;

  @ApiProperty({ nullable: true })
  @Column('int', { nullable: true, name: 'total_time' })
  totalTime?: number;

  @Exclude()
  @Column('uuid', { name: 'author_id' })
  authorId!: string;

  @ApiProperty()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @ApiProperty()
  @VirtualColumn({
    query: (alias) => `${alias}.status = 'PUBLIC'`,
  })
  public!: boolean;

  @Exclude()
  @Column('varchar', { default: TrackStatus.DRAFT })
  status!: TrackStatus;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt!: Date;
}
