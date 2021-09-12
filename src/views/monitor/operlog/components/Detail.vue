<template>
  <BasicModal
    v-bind="$attrs"
    title="操作日志"
    width="700px"
    :showCancelBtn="false"
    :showOkBtn="false"
    @register="register"
  >
    <Form :model="form" ref="formRef" layout="horizontal" class="m-form2">
      <div class="flex">
        <FormItem label="操作模块" class="flex-1">
          <Input :value="form.title + '/' + typeFormat(form.businessType)" readonly />
        </FormItem>
        <FormItem label="请求地址" name="operUrl" class="flex-1">
          <Input :value="form.operUrl" readonly />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="登录信息" class="flex-1">
          <Input :value="form.operName + '/' + form.operIp + '/' + form.operLocation" readonly />
        </FormItem>
        <FormItem label="请求方式" name="requestMethod" class="flex-1">
          <Input :value="form.requestMethod" readonly />
        </FormItem>
      </div>
      <FormItem label="操作方法" name="method" class="flex-1">
        <Input :value="form.method" readonly />
      </FormItem>
      <FormItem label="请求参数" name="operParam" class="flex-1">
        <Textarea :value="form.operParam" readonly />
      </FormItem>
      <FormItem label="返回参数" name="jsonResult" class="flex-1">
        <Input :value="form.jsonResult" readonly />
      </FormItem>
      <div class="flex">
        <FormItem label="操作状态" name="jsonResult" class="flex-1">
          <Input :value="form.status === 0 ? '正常' : '失败'" readonly />
        </FormItem>
        <FormItem label="操作时间" name="operTime" class="flex-1">
          <Input :value="form.operTime" readonly />
        </FormItem>
      </div>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { Form, Input, Textarea } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { OperLogModel } from '/@/api/sys/model/operLogModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { getDicts } from '/@/api/sys/dict';
  import { DictDataModel } from '/@/api/sys/model/dictModel';
  import { selectDictLabel } from '/@/utils';

  interface DataModel {
    form: OperLogModel;
    businessTypeOptions: DictDataModel[];
  }

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      Textarea,
    },
    emits: ['onRefresh', 'register'],
    setup() {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
        businessTypeOptions: [],
      });

      getDicts('sys_oper_type').then((response) => {
        myData.businessTypeOptions = response;
      });

      const [register] = useModalInner((row: OperLogModel) => {
        myData.form = row;
      });

      const typeFormat = (text: string) => {
        return selectDictLabel(myData.businessTypeOptions, text);
      };

      const { filterOption } = useSelect();
      return {
        filterOption,
        ...toRefs(myData),
        register,
        formRef,
        typeFormat,
      };
    },
  });
</script>
