import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { RecordStatus } from './record-status.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ListRecordFilter {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ required: false, nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  myRecords?: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Boolean,
    description: 'Whether to include route data in the response',
  })
  @IsOptional()
  @IsBoolean()
  includeRoute?: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
    isArray: true,
    enum: RecordStatus,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RecordStatus, { each: true })
  statuses?: RecordStatus[];

  @ApiProperty({
    required: false,
    nullable: true,
    isArray: true,
    type: 'string',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  ids!: string[];
}
