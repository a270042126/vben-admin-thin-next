import { DictDataModel, DictTypeModel, TypeListModel } from './model/dictModel';
import { BasicParams } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Options = '/system/dict/type/optionselect',
  getDicts = '/system/dict/data/type/',
  list = '/system/dict/type/list',
  type = '/system/dict/type',
  export = '/system/dict/type/export',
  refreshCache = '/system/dict/type/refreshCache',
}

export const getDictTypeOptions = () => {
  return defHttp.get<DictTypeModel[]>({ url: Api.Options });
};

export const getDicts = (type: string) => {
  return defHttp.get<DictDataModel[]>({ url: `${Api.getDicts}${type}` });
};
// 刷新缓存
export const refreshCache = () => {
  return defHttp.delete<TypeListModel>({ url: Api.refreshCache });
};

// 查询字典类型列表
export const getTypeList = (params?: BasicParams) => {
  return defHttp.get<TypeListModel>({ url: Api.list, params });
};
// 查询字典类型详细
export const getType = (dictId: string | null) => {
  return defHttp.get<DictTypeModel>({ url: Api.type + '/' + dictId });
};
// 新增字典类型
export const addType = (data: DictTypeModel) => {
  return defHttp.post({ url: Api.type, data });
};
// 修改字典类型
export const updateType = (data: DictTypeModel) => {
  return defHttp.put({ url: Api.type, data });
};
// 删除字典类型
export const delType = (id: any | any[]) => {
  return defHttp.delete({ url: Api.type + '/' + id });
};
// 导出字典类型
export const exportType = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.type + '/export', params });
};
