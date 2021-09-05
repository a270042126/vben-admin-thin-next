import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface RoleModel {
  /** 角色ID */
  roleId?: number | null;
  /** 角色名称 */
  roleName?: string | null;
  /** 角色权限字符串 */
  roleKey?: string | null;
  /** 显示顺序 */
  roleSort?: number | null;
  /** 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限） */
  dataScope?: string | null;
  /** 菜单树选择项是否关联显示 */
  menuCheckStrictly?: number | null;
  /** 部门树选择项是否关联显示 */
  deptCheckStrictly?: number | null;
  /** 角色状态（0正常 1停用） */
  status?: string | null;
  /** 删除标志（0代表存在 2代表删除） */
  delFlag?: string | null;
  deptIds?: number[];
}

export type RoleListModel = BasicFetchResult<RoleModel[]>;
