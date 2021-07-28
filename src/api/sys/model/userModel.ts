import type { UserInfo } from '/#/store';
import type { BasicFetchResult } from '/@/api/model/baseModel';
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
  userId: number;
  departId: number;
  userName: string;
  nickName: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string;
  enable: boolean;
  status: string;
  delFlag: string;
  loginIp: string;
  createTime: string;
  roleIds?: String[];
}

export type UserListModel = BasicFetchResult<UserModel>;
