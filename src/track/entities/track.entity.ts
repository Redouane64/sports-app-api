import { User } from 'src/user/entities/user.entity';
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

  // TODO: may be upgrade to PostGIS native types
  @Column('jsonb', { default: `[]` })
  route: unknown;

  @Column('int', { nullable: true, name: 'total_distance' })
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
