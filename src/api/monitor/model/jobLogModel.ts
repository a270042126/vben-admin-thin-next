import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface JobLogModel {
  /** 任务日志ID */
  jobLogId?: number | null;
  /** 任务名称 */
  jobName?: string | null;
  /** 任务组名 */
  jobGroup?: string | null;
  /** 调用目标字符串 */
  invokeTarget?: string | null;
  /** 日志信息 */
  jobMessage?: string | null;
  /** 执行状态（0正常 1失败） */
  status?: string | null;
  /** 异常信息 */
  exceptionInfo?: string | null;
}

export type LogListModel = BasicFetchResult<JobLogModel>;
