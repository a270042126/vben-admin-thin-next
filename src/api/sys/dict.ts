import { DictDataModel, DictTypeModel } from './model/dictModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Options = '/system/dict/type/optionselect',
  getDicts = '/system/dict/data/type/',
}

export const getDictTypeOptions = () => {
  return defHttp.get<DictTypeModel[]>({ url: Api.Options });
};

export const getDicts = (type: string) => {
  return defHttp.get<DictDataModel>({ url: `${Api.getDicts}${type}` });
};
