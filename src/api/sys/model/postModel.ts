export interface PostModel {
  /** 岗位序号 */
  postId: number;
  /** 岗位编码 */
  postCode: string;
  /** 岗位名称 */
  postName: string;
  /** 岗位排序 */
  postSort: string;
  /** 状态（0正常 1停用） */
  status: string;
  /** 用户是否存在此岗位标识 默认不存在 */
  flag: boolean;
}
