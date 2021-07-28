export interface BasicPageParams {
  pageNum: Number;
  pageSize: Number;
  orderByColumn?: string;
  isAsc?: string;
  params?: Record<string, any>;
}

export interface BasicFetchResult<T extends any> {
  rows: T[];
  total: Number;
}
