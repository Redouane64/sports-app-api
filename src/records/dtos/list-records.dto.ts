import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { RecordStatus } from './record-status.dto';

export class ListRecordFilter {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(RecordStatus, { each: true })
  statuses?: RecordStatus[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  ids!: string[];
}
