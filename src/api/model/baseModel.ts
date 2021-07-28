import { BasicColumn } from '/@/components/Table/index';
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
  columns: BasicColumn[];
}

export interface BasicFetchResult<T extends any> {
  rows: T[];
  total: Number;
}
