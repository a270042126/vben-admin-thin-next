<template>
  <BasicModal
    v-bind="$attrs"
    title="调度日志"
    width="700px"
    :showCancelBtn="false"
    :showOkBtn="false"
    @register="register"
  >
    <Form :model="form" ref="formRef" layout="horizontal" class="m-form2">
      <div class="flex">
        <FormItem label="任务名称" class="flex-1">
          <Input :value="form.jobName" readonly />
        </FormItem>
        <FormItem label="任务分组" name="jobGroup" class="flex-1">
          <Input :value="form.jobGroup" readonly />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="调用方法" class="flex-1">
          <Input :value="form.invokeTarget" readonly />
        </FormItem>
        <FormItem label="执行时间" name="createTime" class="flex-1">
          <Input :value="form.createTime" readonly />
        </FormItem>
      </div>
      <FormItem label="日志信息" name="jobMessage" class="flex-1">
        <Input :value="form.jobMessage" readonly />
      </FormItem>
      <div class="flex">
        <FormItem label="操作状态" class="flex-1">
          <Input :value="form.status === 0 ? '正常' : '失败'" readonly />
        </FormItem>
      </div>
      <FormItem v-if="form.status == 1" label="异常信息：" class="flex-1">
        <Textarea :value="form.exceptionInfo" readonly />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { Form, Input, Textarea } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { JobLogModel } from '/@/api/monitor/model/jobLogModel';
  // import { selectDictLabel } from '/@/utils';

  interface DataModel {
    form: JobLogModel;
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
      });

      const [register] = useModalInner((row: JobLogModel) => {
        myData.form = row;
      });

      const { filterOption } = useSelect();
      return {
        filterOption,
        ...toRefs(myData),
        register,
        formRef,
      };
    },
  });
</script>
