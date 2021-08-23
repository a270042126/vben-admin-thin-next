import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel, MenuModel, MenuTreeModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getRouters',
  MenuList = '/system/menu/list',
  treeselect = '/system/menu/treeselect',
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
