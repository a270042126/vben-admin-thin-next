<template>
  <BasicModal v-bind="$attrs" title="上传Excel" width="400px" :minHeight="50" @register="register">
    <div class="upload-main">
      <Dragger name="file" :action="uploadUrl" :headers="headers" :onChange="onChange" class="drag">
        <Icon icon="ant-design:upload-outlined" class="uopload-icon" />
      </Dragger>
      <div v-if="templateUrl || fileName" class="mt-4">
        <a-button type="link" @click="handleDowload"
          ><Icon icon="ant-design:vertical-align-bottom-outlined" />下载模板</a-button
        >
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Icon } from '/@/components/Icon';
  import { Upload, message } from 'ant-design-vue';
  import { download, download2 } from '/@/utils';
  import { getToken } from '/@/utils/auth';
  import { UploadDataModel } from './UploadModel';

  interface MyDataModel {
    fileName: string | null;
    templateUrl: string | null;
    uploadUrl: string | null;
    headers: Recordable;
  }

  export default defineComponent({
    components: { BasicModal, Icon, Dragger: Upload.Dragger },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const myData = reactive<MyDataModel>({
        fileName: null,
        templateUrl: null,
        uploadUrl: null,
        headers: { Authorization: 'Bearer ' + getToken() },
      });
      const [register, { closeModal }] = useModalInner((data: UploadDataModel) => {
        data.fileName && (myData.fileName = data.fileName);
        data.templateUrl && (myData.templateUrl = data.templateUrl);
        data.uploadUrl && (myData.uploadUrl = data.uploadUrl);
      });

      const handleDowload = () => {
        if (myData.templateUrl) {
          download2(myData.templateUrl);
        } else if (myData.fileName) {
          download(myData.fileName);
        }
      };

      const onChange = ({ file }) => {
        if (file.response && file.response.code !== 200) {
          message.error(file.response.msg);
        } else if (file.response && file.response.code === 200) {
          message.success('上传成功');
          context.emit('onRefresh');
          closeModal();
        }
      };

      return {
        register,
        handleDowload,
        ...toRefs(myData),
        onChange,
      };
    },
  });
</script>

<style lang="less" scoped>
  .upload-main {
    .uopload-icon {
      margin: 40px 0;
      font-size: 40px !important;
    }
  }
</style>
