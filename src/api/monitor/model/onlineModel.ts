import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface OnlineModel {
  /** 会话编号 */
  tokenId?: string | null;
  /** 部门名称 */
  deptName?: string | null;
  /** 用户名称 */
  userName?: string | null;
  /** 登录IP地址 */
  ipaddr?: string | null;
  /** 登录地址 */
  loginLocation?: string | null;
  /** 浏览器类型 */
  browser?: string | null;
  /** 操作系统 */
  os?: string | null;
  /** 登录时间 */
  loginTime?: number | null;
}

export type OnlineListModel = BasicFetchResult<OnlineModel>;
