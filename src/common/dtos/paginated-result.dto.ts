import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from './pagination-params.dto';

export class PaginatedResult<T> {
  constructor(items: T[], total: number, pagination: PaginationParams) {
    this.items = items;
    this.total = total;
    this.hasMore = total - pagination.page! * pagination.perPage! > 0;
  }

  @ApiProperty()
  total: number;

  @ApiProperty()
  hasMore?: boolean;

  @ApiProperty()
  items: T[];
}
