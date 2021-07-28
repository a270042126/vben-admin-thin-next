import { BasicPageParams } from '/@/api/model/baseModel';
export function useList(getList: () => void, queryParams: BasicPageParams) {
  const search = () => {
    queryParams.pageNum = 1;
    queryParams.pageSize = 10;
    getList();
  };

  const handlePageNumChange = (pageNum: Number) => {
    queryParams.pageNum = pageNum;
    getList();
  };

  const handlePageSizeChange = (current: Number, size: Number) => {
    queryParams.pageNum = current;
    queryParams.pageSize = size;
    getList();
  };

  return {
    getList,
    search,
    handlePageNumChange,
    handlePageSizeChange,
  };
}
