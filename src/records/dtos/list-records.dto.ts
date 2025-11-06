import { IsOptional, IsUUID } from 'class-validator';

export class ListRecordFilter {
  @IsOptional()
  @IsUUID()
  trackId?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;
}
