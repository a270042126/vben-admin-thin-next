import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { JobModel, JobListModel } from './model/jobModel';
enum Api {
  list = '/monitor/job/list',
  job = '/monitor/job',
  export = '/monitor/job/export',
  run = '/monitor/job/run',
}
// 查询定时任务调度列表
export const getJobList = (params: BasicParams) => {
  return defHttp.get<JobListModel>({ url: Api.list, params });
};
// 查询定时任务调度详细
export const getJob = (jobId: number | null) => {
  return defHttp.get<JobModel>({ url: Api.job + '/' + jobId });
};
// 新增定时任务调度
export const addJob = (data: JobModel) => {
  return defHttp.post({ url: Api.job, data });
};
// 修改定时任务调度
export const updateJob = (data: JobModel) => {
  return defHttp.put({ url: Api.job, data });
};
// 删除定时任务调度
export const delJob = (id: any | any[]) => {
  return defHttp.delete({ url: Api.job + '/' + id });
};
// 导出定时任务调度
export const exportJob = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.job + '/export', params });
};

export const run = (data: JobModel) => {
  return defHttp.put({ url: Api.run, data });
};
