export interface RoleModel {
  /** 角色ID */
  roleId?: number | null;
  /** 角色名称 */
  roleName?: string | null;
  /** 角色权限 */
  roleKey?: string | null;
  /** 角色排序 */
  roleSort?: string | null;
  /** 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限；5：仅本人数据权限） */
  dataScope?: string | null;
  /** 菜单树选择项是否关联显示（ 0：父子不互相关联显示 1：父子互相关联显示） */
  menuCheckStrictly?: boolean;
  /** 部门树选择项是否关联显示（0：父子不互相关联显示 1：父子互相关联显示 ） */
  deptCheckStrictly?: boolean;
  /** 角色状态（0正常 1停用） */
  status?: string | null;
  /** 删除标志（0代表存在 2代表删除） */
  delFlag?: string | null;
  /** 用户是否存在此角色标识 默认不存在 */
  flag?: boolean;
  /** 菜单组 */
  menuIds?: number[];
  /** 部门组（数据权限） */
  deptIds?: number[];
}
