import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { OperLogModel, OperLogListModel } from './model/operLogModel';
enum Api {
  list = '/monitor/operlog/list',
  operLog = '/monitor/operlog',
  export = '/monitor/operlog/export',
  clean = '/monitor/operlog/clean',
}
// 查询操作日志记录列表
export const getOperLogList = (params: BasicParams) => {
  return defHttp.get<OperLogListModel>({ url: Api.list, params });
};
// 查询操作日志记录详细
export const getOperLog = (operId: number | null) => {
  return defHttp.get<OperLogModel>({ url: Api.operLog + '/' + operId });
};
// 删除操作日志记录
export const delOperLog = (id: any | any[]) => {
  return defHttp.delete({ url: Api.operLog + '/' + id });
};
// 导出操作日志记录
export const exportOperLog = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.operLog + '/export', params });
};

export const clean = () => {
  return defHttp.delete({ url: Api.clean });
};
