import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel, MenuModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getRouters',
  MenuList = '/system/menu/list',
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
