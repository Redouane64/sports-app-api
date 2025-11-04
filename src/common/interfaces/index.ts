export interface PageResponse<T> {
  total: number;
  hasMore: boolean;
  data: Array<T>;
}

export interface Pagination {
  page: number;
  pageSize: number;
}
