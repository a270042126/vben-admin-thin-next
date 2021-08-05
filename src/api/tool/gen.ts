import { defHttp } from '/@/utils/http/axios';
import { genTableListModel } from './model/genModel';
import { BasicParams } from '/@/api/model/baseModel';
enum Api {
  genTablelist = '/tool/gen/list',
  dbList = '/tool/gen/db/list',
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
