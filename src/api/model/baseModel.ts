export interface BasicParams {
  pageNum?: Number;
  pageSize?: Number;
  orderByColumn?: string;
  isAsc?: string;
  params?: Recordable;
}

export interface BasicData<T> {
  dataList: T[];
  total: Number;
  loading?: boolean;
}

export interface BasicFetchResult<T extends any> {
  rows: T[];
  total: Number;
}
