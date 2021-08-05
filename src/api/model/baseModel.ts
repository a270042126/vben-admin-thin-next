export interface BasicParams extends Recordable {
  pageNum?: number;
  pageSize?: number;
  orderByColumn?: string;
  isAsc?: string;
  params?: Recordable;
}

export interface BasicData {
  queryParams: BasicParams;
}

export interface BasicFetchResult<T extends any> {
  rows: T[];
  total: number;
}
