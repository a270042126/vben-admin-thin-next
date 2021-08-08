import { defHttp } from '/@/utils/http/axios';
import { genTableListModel, EditGenTableModel, GenTableModel } from './model/genModel';
import { BasicParams } from '/@/api/model/baseModel';
enum Api {
  genTablelist = '/tool/gen/list',
  dbList = '/tool/gen/db/list',
  gen = '/tool/gen',
  importTable = '/tool/gen/importTable',
}

/**
 * @description: Get user menu based on id
 */

export const getGenTableList = (params: BasicParams) => {
  return defHttp.get<genTableListModel>({ url: Api.genTablelist, params });
};

export const getDbList = (params: BasicParams) => {
  return defHttp.get<genTableListModel>({ url: Api.dbList, params });
};

export const deleteGenTable = (id: number | string[]) => {
  return defHttp.delete({ url: `${Api.gen}/${id}` });
};

export const importTable = (tables: string) => {
  return defHttp.post({ url: `${Api.importTable}?tables=${tables}` });
};

export const getGenTableByTableId = (id: string) => {
  return defHttp.get<EditGenTableModel>({ url: `${Api.gen}/${id}` });
};

export const updateGenTable = (data: GenTableModel) => {
  return defHttp.put({ url: Api.gen, data });
};
