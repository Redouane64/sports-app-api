import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from './pagination-params.dto';
import { Type } from '@nestjs/common';

export class PaginatedResult<T> {
  constructor(items: T[], total: number, pagination: PaginationParams) {
    this.items = items;
    this.total = total;
    this.hasMore = total - pagination.page! * pagination.perPage! > 0;
  }

  @ApiProperty({ nullable: false })
  total: number;

  @ApiProperty({ nullable: false })
  hasMore?: boolean;

  @ApiProperty({ isArray: true, items: { type: 'object' } })
  items: T[];
}

export function PaginatedResponse<T>(classRef: Type<T>) {
  class PaginatedResult {
    @ApiProperty({ nullable: false })
    total!: number;

    @ApiProperty({ nullable: false })
    hasMore?: boolean;

    @ApiProperty({ isArray: true, type: classRef })
    items!: T[];
  }

  return PaginatedResult;
}
