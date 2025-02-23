import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

export interface MenuModel {
  /** 菜单ID */
  menuId?: string;
  /** 菜单名称 */
  menuName?: string;
  /** 父菜单名称 */
  parentName?: string;
  /** 父菜单ID */
  parentId?: number;
  /** 显示顺序 */
  orderNum?: string;
  /** 路由地址 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 是否为外链（0是 1否） */
  isFrame?: string;
  /** 是否缓存（0缓存 1不缓存） */
  isCache?: string;
  /** 类型（M目录 C菜单 F按钮） */
  menuType?: string;
  /** 显示状态（0显示 1隐藏） */
  visible?: string;
  /** 菜单状态（0显示 1隐藏） */
  status?: string;
  /** 权限字符串 */
  perms?: string;
  /** 菜单图标 */
  icon?: string;
  /** 子菜单 */
  children?: MenuModel[];
}

export interface MenuTreeModel {
  id: number;
  label: string;
  children: MenuTreeModel[];
}

export interface RoleMenuSelectModel {
  checkedKeys: number[];
  menus: MenuTreeModel[];
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];
