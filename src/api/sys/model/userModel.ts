import type { UserInfo } from '/#/store';
import type { BasicFetchResult } from '/@/api/model/baseModel';
import { RoleModel } from './roleModel';
import { PostModel } from './postModel';
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */

export interface GetUserInfoModel {
  roles: Array<string>;
  permissions: Array<string>;
  user: UserInfo;
}

export interface UserModel {
  userId?: number | null;
  deptId?: number | null;
  userName?: string | null;
  nickName?: string | null;
  email?: string | null;
  phonenumber?: string | null;
  sex?: string | null;
  avatar?: string | null;
  enable?: boolean | null;
  status?: string | null;
  delFlag?: string | null;
  loginIp?: string | null;
  createTime?: string | null;
  roleIds?: number[];
}

export interface UserDepRoleModel {
  roles: RoleModel[];
  posts: PostModel[];
  postIds: number[];
  roleIds: number[];
  data: UserModel;
}

export type UserListModel = BasicFetchResult<UserModel>;
