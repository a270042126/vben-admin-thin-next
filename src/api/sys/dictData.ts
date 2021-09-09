import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { DictDataModel, DataListModel } from './model/dictModel';
enum Api {
  list = '/system/dict/data/list',
  data = '/system/dict/data',
  export = '/system/dict/data/export',
}
// 查询字典数据列表
export const getDataList = (params: BasicParams) => {
  return defHttp.get<DataListModel>({ url: Api.list, params });
};
// 查询字典数据详细
export const getData = (dictCode: string | null) => {
  return defHttp.get<DictDataModel>({ url: Api.data + '/' + dictCode });
};
// 新增字典数据
export const addData = (data: DictDataModel) => {
  return defHttp.post({ url: Api.data, data });
};
// 修改字典数据
export const updateData = (data: DictDataModel) => {
  return defHttp.put({ url: Api.data, data });
};
// 删除字典数据
export const delData = (id: any | any[]) => {
  return defHttp.delete({ url: Api.data + '/' + id });
};
// 导出字典数据
export const exportData = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.data + '/export', params });
};
