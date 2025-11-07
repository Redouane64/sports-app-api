import { PaginationParams } from './pagination-params.dto';

export class PaginatedResult<T> {
  constructor(items: T[], total: number, pagination: PaginationParams) {
    this.items = items;
    this.total = total;
    this.hasMore = total - pagination.page! * pagination.perPage! > 0;
  }

  items: T[];
  total: number;
  hasMore?: boolean;
}
