import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel, UserListModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getInfo',
  GetPermCode = '/getPermCode',
  GetUserList = '/system/user/list',
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

export function getUserList(params) {
  return defHttp.get<UserListModel>({ url: Api.GetUserList }, params);
}
