import { defHttp } from '/@/utils/http/axios';
import { BasicParams } from '/@/api/model/baseModel';
import { PostModel, PostListModel } from './model/postModel';
enum Api {
  list = '/system/post/list',
  post = '/system/post',
  export = '/system/post/export',
}
// 查询岗位信息列表
export const getPostList = (params: BasicParams) => {
  return defHttp.get<PostListModel>({ url: Api.list, params });
};
// 查询岗位信息详细
export const getPost = (postId: number | null) => {
  return defHttp.get<PostModel>({ url: Api.post + '/' + postId });
};
// 新增岗位信息
export const addPost = (data: PostModel) => {
  return defHttp.post({ url: Api.post, data });
};
// 修改岗位信息
export const updatePost = (data: PostModel) => {
  return defHttp.put({ url: Api.post, data });
};
// 删除岗位信息
export const delPost = (id: any | any[]) => {
  return defHttp.delete({ url: Api.post + '/' + id });
};
// 导出岗位信息
export const exportPost = (params: BasicParams) => {
  return defHttp.get<string>({ url: Api.post + '/export', params });
};
