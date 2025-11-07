import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { RecordStatus } from './record-status.dto';

export class ListRecordFilter {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  ids!: string[];
}
