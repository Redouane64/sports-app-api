import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class ListRecordFilter {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  ids!: string[];
}
