import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
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
  menu = '/system/menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

// 查询菜单权限详细
export const getMenu = (menuId: string | null) => {
  return defHttp.get<MenuModel>({ url: Api.menu + '/' + menuId });
};
// 新增菜单权限
export const addMenu = (data: MenuModel) => {
  return defHttp.post({ url: Api.menu, data });
};
// 修改菜单权限
export const updateMenu = (data: MenuModel) => {
  return defHttp.put({ url: Api.menu, data });
};
// 删除菜单权限
export const delMenu = (id: any | any[]) => {
  return defHttp.delete({ url: Api.menu + '/' + id });
};
// 导出菜单权限
export const exportMenu = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.menu + '/export', params });
};

export const getRouteMenuList = (params?: BasicParams) => {
  return defHttp.get<MenuModel[]>({ url: Api.MenuList, params });
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
