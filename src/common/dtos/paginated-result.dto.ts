import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
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

  items: T[];
}

export function PaginatedResponse<T>(classRef: Type<T>) {
  @ApiExtraModels(classRef)
  class PaginatedResultClass extends PaginatedResult<T> {
    constructor(items: T[], total: number, pagination: PaginationParams) {
      super(items, total, pagination);
      this.items = items;
    }

    @ApiProperty({ isArray: true, type: classRef })
    items: T[];
  }

  Object.defineProperty(PaginatedResultClass, 'name', {
    value: `${classRef.name}PaginatedResult`,
  });

  return PaginatedResultClass;
}
