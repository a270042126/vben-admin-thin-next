export interface BasicPageParams {
  pageNum?: Number;
  pageSize?: Number;
  orderByColumn?: string;
  isAsc?: string;
  params?: Record<string, any>;
}

export interface BasicData<T> {
  queryParams: BasicPageParams;
  dataList: T[];
  total: Number;
  loading?: boolean;
}

export interface BasicFetchResult<T extends any> {
  rows: T[];
  total: Number;
}
