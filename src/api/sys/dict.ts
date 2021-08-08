import { DictTypeModel } from './model/dictModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Options = '/system/dict/type/optionselect',
}

export const getDictTypeOptions = () => {
  return defHttp.get<DictTypeModel[]>({ url: Api.Options });
};
