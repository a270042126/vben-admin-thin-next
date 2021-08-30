import { defHttp } from '/@/utils/http/axios';
import {
  getMenuListResultModel,
  MenuModel,
  MenuTreeModel,
  RoleMenuSelectModel,
} from './model/menuModel';

enum Api {
  GetMenuList = '/getRouters',
  MenuList = '/system/menu/list',
  treeselect = '/system/menu/treeselect',
  roleMenuTreeSelect = '/system/menu/roleMenuTreeselect/',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

export const getRouteMenuList = () => {
  return defHttp.get<MenuModel[]>({ url: Api.MenuList });
};

export const getTreeSelect = () => {
  return defHttp.get<MenuTreeModel[]>({ url: Api.treeselect });
};

export const roleMenuTreeSelect = (roleId: number) => {
  return defHttp.get<RoleMenuSelectModel>(
    { url: Api.roleMenuTreeSelect + roleId },
    { isNotData: true }
  );
};
