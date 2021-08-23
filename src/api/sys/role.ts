import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { RoleModel, RoleListModel } from './model/roleModel';
enum Api {
  list = '/system/role/list',
  role = '/system/role',
  export = '/system/role/export',
  changeStatus = '/system/role/changeStatus',
}
// 查询角色信息列表
export const getRoleList = (params: BasicParams) => {
  return defHttp.get<RoleListModel>({ url: Api.list, params });
};
// 查询角色信息详细
export const getRole = (roleId: number | null) => {
  return defHttp.get<RoleModel>({ url: Api.role + '/' + roleId });
};
// 新增角色信息
export const addRole = (data: RoleModel) => {
  return defHttp.post({ url: Api.role, data });
};
// 修改角色信息
export const updateRole = (data: RoleModel) => {
  return defHttp.put({ url: Api.role, data });
};
// 删除角色信息
export const delRole = (id: any | any[]) => {
  return defHttp.delete({ url: Api.role + '/' + id });
};
// 导出角色信息
export const exportRole = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.role + '/export', params });
};
// 更改角色状态
export const changeStatus = (data: RoleModel) => {
  return defHttp.put({ url: Api.changeStatus, data });
};
