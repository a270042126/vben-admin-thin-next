import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface DeptModel {
  /** 部门id */
  deptId?: number | null;
  /** 父部门id */
  parentId?: number | null;
  /** 祖级列表 */
  ancestors?: string | null;
  /** 部门名称 */
  deptName?: string | null;
  /** 显示顺序 */
  orderNum?: number | null;
  /** 负责人 */
  leader?: string | null;
  /** 联系电话 */
  phone?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 部门状态（0正常 1停用） */
  status?: string | null;
  /** 删除标志（0代表存在 2代表删除） */
  delFlag?: string | null;
}

export type DeptListModel = BasicFetchResult<DeptModel>;

export interface DepartTreeModel {
  id: number;
  label: string;
  children: DepartTreeModel[];
}

export interface RoleDeptTreeModel {
  checkedKeys: number[];
  depts: DepartTreeModel[];
}
