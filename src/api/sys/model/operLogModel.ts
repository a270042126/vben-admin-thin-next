import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface OperLogModel {
  /** 日志主键 */
  operId?: number | null;
  /** 模块标题 */
  title?: string | null;
  /** 业务类型（0其它 1新增 2修改 3删除） */
  businessType?: number | null;
  /** 方法名称 */
  method?: string | null;
  /** 请求方式 */
  requestMethod?: string | null;
  /** 操作类别（0其它 1后台用户 2手机端用户） */
  operatorType?: number | null;
  /** 操作人员 */
  operName?: string | null;
  /** 部门名称 */
  deptName?: string | null;
  /** 请求URL */
  operUrl?: string | null;
  /** 主机地址 */
  operIp?: string | null;
  /** 操作地点 */
  operLocation?: string | null;
  /** 请求参数 */
  operParam?: string | null;
  /** 返回参数 */
  jsonResult?: string | null;
  /** 操作状态（0正常 1异常） */
  status?: number | null;
  /** 错误消息 */
  errorMsg?: string | null;
  /** 操作时间 */
  operTime?: Date | null;
}

export type OperLogListModel = BasicFetchResult<OperLogModel>;
