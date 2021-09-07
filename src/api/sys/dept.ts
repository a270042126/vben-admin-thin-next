import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { DepartTreeModel, RoleDeptTreeModel, DeptModel, DeptListModel } from './model/departModel';
enum Api {
  getDepartTree = '/system/dept/treeselect',
  roleDeptTreeselect = '/system/dept/roleDeptTreeselect/',
  list = '/system/dept/list',
  dept = '/system/dept',
  export = '/system/dept/export',
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

// 查询部门列表
export const getDeptList = (params?: BasicParams) => {
  return defHttp.get<DeptListModel>({ url: Api.list, params });
};
// 查询部门详细
export const getDept = (deptId: number | null) => {
  return defHttp.get<DeptModel>({ url: Api.dept + '/' + deptId });
};
// 新增部门
export const addDept = (data: DeptModel) => {
  return defHttp.post({ url: Api.dept, data });
};
// 修改部门
export const updateDept = (data: DeptModel) => {
  return defHttp.put({ url: Api.dept, data });
};
// 删除部门
export const delDept = (id: any | any[]) => {
  return defHttp.delete({ url: Api.dept + '/' + id });
};
// 导出部门
export const exportDept = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.dept + '/export', params });
};
