import { defHttp } from '/@/utils/http/axios';
import { DepartTreeModel } from './model/departModel';
enum Api {
  getDepartTree = '/system/dept/treeselect',
}

/**
 * @description: Get user menu based on id
 */

export const getDepartTree = () => {
  return defHttp.get<DepartTreeModel[]>({ url: Api.getDepartTree });
};
