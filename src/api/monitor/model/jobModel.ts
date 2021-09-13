import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface JobModel {
  /** 任务ID */
  jobId?: number | null;
  /** 任务名称 */
  jobName?: string | null;
  /** 任务组名 */
  jobGroup?: string | null;
  /** 调用目标字符串 */
  invokeTarget?: string | null;
  /** cron执行表达式 */
  cronExpression?: string | null;
  /** 计划执行错误策略（1立即执行 2执行一次 3放弃执行） */
  misfirePolicy?: number | null;
  /** 是否并发执行（0允许 1禁止） */
  concurrent?: string | null;
  /** 状态（0正常 1暂停） */
  status?: string | null;
}

export type JobListModel = BasicFetchResult<JobModel>;
