import type { BasicFetchResult } from '/@/api/model/baseModel';

export interface PostModel {
  /** 岗位ID */
  postId?: number | null;
  /** 岗位编码 */
  postCode?: string | null;
  /** 岗位名称 */
  postName?: string | null;
  /** 显示顺序 */
  postSort?: number | null;
  /** 状态（0正常 1停用） */
  status?: string | null;
}

export type PostListModel = BasicFetchResult<PostModel>;
