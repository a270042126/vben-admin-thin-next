import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { JobLogModel, LogListModel } from './model/jobLogModel';
enum Api {
  list = '/monitor/jobLog/list',
  log = '/monitor/jobLog',
  export = '/monitor/jobLog/export',
}
// 查询定时任务调度日志列表
export const getLogList = (params: BasicParams) => {
  return defHttp.get<LogListModel>({ url: Api.list, params });
};
// 查询定时任务调度日志详细
export const getLog = (jobLogId: number | null) => {
  return defHttp.get<JobLogModel>({ url: Api.log + '/' + jobLogId });
};
// 删除定时任务调度日志
export const delLog = (id: any | any[]) => {
  return defHttp.delete({ url: Api.log + '/' + id });
};
// 导出定时任务调度日志
export const exportLog = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.log + '/export', params });
};
