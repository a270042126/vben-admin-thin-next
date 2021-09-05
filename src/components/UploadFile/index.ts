import { withInstall } from '/@/utils';
import UploadFile from './src/UploadFile.vue';
import { UploadDataModel } from './src/UploadModel';

export const Upload = withInstall(UploadFile);

export type UploadModel = UploadDataModel;
