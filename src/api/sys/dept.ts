import { defHttp } from '/@/utils/http/axios';
import { departModel } from './model/departModel';
enum Api {
  getDepartTree = '/system/dept/treeselect',
}

/**
 * @description: Get user menu based on id
 */

export const getDepartTree = () => {
  return defHttp.get<departModel[]>({ url: Api.getDepartTree });
};
