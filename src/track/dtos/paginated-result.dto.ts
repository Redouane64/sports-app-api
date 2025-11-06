export class PaginatedResult<T> {
  constructor(items: T[], total: number, hasMore?: boolean) {
    this.items = items;
    this.total = total;
    this.hasMore = !!hasMore;
  }

  items: T[];
  total: number;
  hasMore?: boolean;
}
