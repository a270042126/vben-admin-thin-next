import { defHttp } from '/@/utils/http/axios';
import { DepartTreeModel, RoleDeptTreeModel } from './model/departModel';
enum Api {
  getDepartTree = '/system/dept/treeselect',
  roleDeptTreeselect = '/system/dept/roleDeptTreeselect/',
}

/**
 * @description: Get user menu based on id
 */

export const getDepartTree = () => {
  return defHttp.get<DepartTreeModel[]>({ url: Api.getDepartTree });
};

export const roleDeptTreeselect = (roleId: number) => {
  return defHttp.get<RoleDeptTreeModel>(
    { url: Api.roleDeptTreeselect + roleId },
    { isNotData: true }
  );
};
