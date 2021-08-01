import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  UserListModel,
  UserDepRoleModel,
  UserModel,
} from './model/userModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getInfo',
  GetPermCode = '/getPermCode',
  GetUserList = '/system/user/list',
  User = '/system/user/',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      isNotData: true,
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { isNotData: true });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function getUserList(params: Recordable) {
  return defHttp.get<UserListModel>({ url: Api.GetUserList, params });
}

export function getUser(id: number | null) {
  const url = id ? `${Api.User}${id}` : Api.User;
  return defHttp.get<UserDepRoleModel>({ url: url }, { isNotData: true });
}

export function addUser(data: UserModel) {
  return defHttp.post({ url: Api.User, data });
}

export function updateUser(data: UserModel) {
  return defHttp.put({ url: Api.User, data });
}

export function deleteUser(data: number | number[]) {
  return defHttp.delete({ url: `${Api.User}${data}` });
}
