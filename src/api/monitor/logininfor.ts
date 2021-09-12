import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { LogininforModel, LogininforListModel } from './model/logininforModel';
enum Api {
  list = '/monitor/logininfor/list',
  logininfor = '/monitor/logininfor',
  export = '/monitor/logininfor/export',
  clean = '/monitor/logininfor/clean',
}
// 查询系统访问记录列表
export const getLogininforList = (params: BasicParams) => {
  return defHttp.get<LogininforListModel>({ url: Api.list, params });
};
// 查询系统访问记录详细
export const getLogininfor = (infoId: number | null) => {
  return defHttp.get<LogininforModel>({ url: Api.logininfor + '/' + infoId });
};
// 删除系统访问记录
export const delLogininfor = (id: any | any[]) => {
  return defHttp.delete({ url: Api.logininfor + '/' + id });
};
// 导出系统访问记录
export const exportLogininfor = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.logininfor + '/export', params });
};

export const clean = () => {
  return defHttp.delete({ url: Api.clean });
};
