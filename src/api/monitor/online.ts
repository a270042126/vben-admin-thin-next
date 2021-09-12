import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { OnlineListModel } from './model/onlineModel';
enum Api {
  list = '/monitor/online/list',
  online = '/monitor/online',
}
// 查询系统访问记录列表
export const getOnlineList = (params: BasicParams) => {
  return defHttp.get<OnlineListModel>({ url: Api.list, params });
};

export const forceLogout = (id: string) => {
  return defHttp.delete({ url: Api.online + '/' + id });
};
