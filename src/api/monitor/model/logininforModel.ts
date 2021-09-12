import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface LogininforModel {
  /** 访问ID */
  infoId?: number | null;
  /** 用户账号 */
  userName?: string | null;
  /** 登录IP地址 */
  ipaddr?: string | null;
  /** 登录地点 */
  loginLocation?: string | null;
  /** 浏览器类型 */
  browser?: string | null;
  /** 操作系统 */
  os?: string | null;
  /** 登录状态（0成功 1失败） */
  status?: string | null;
  /** 提示消息 */
  msg?: string | null;
  /** 访问时间 */
  loginTime?: Date | null;
}

export type LogininforListModel = BasicFetchResult<LogininforModel>;
