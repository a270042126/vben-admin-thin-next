<template>
  <BasicModal
    v-bind="$attrs"
    title="任务详情"
    width="700px"
    :showCancelBtn="false"
    :showOkBtn="false"
    @register="register"
  >
    <Form :model="form" ref="formRef" layout="horizontal" class="m-form2">
      <div class="flex">
        <FormItem label="任务编号" class="flex-1">
          <Input :value="form.jobId" readonly />
        </FormItem>
        <FormItem label="任务名称" class="flex-1">
          <Input :value="form.jobName" readonly />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="任务分组" name="jobGroup" class="flex-1">
          <Input :value="form.jobGroup" readonly />
        </FormItem>
        <FormItem label="创建时间" name="createTime" class="flex-1">
          <Input :value="form.createTime" readonly />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="cron表达式" class="flex-1">
          <Input :value="form.cronExpression" readonly />
        </FormItem>
        <FormItem label="下次执行时间" class="flex-1">
          <Input :value="form.nextValidTime" readonly />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="调用目标方法" class="flex-1">
          <Input :value="form.invokeTarget" readonly />
        </FormItem>
        <FormItem label="任务状态" class="flex-1">
          <Input :value="form.status === 0 ? '正常' : '失败'" readonly />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="是否并发" class="flex-1">
          <Input :value="form.concurrent === 0 ? '允许' : '禁止'" readonly />
        </FormItem>
        <FormItem label="执行策略" class="flex-1">
          <Input :value="getMisfirePolicy" readonly />
        </FormItem>
      </div>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref, computed } from 'vue';
  import { Form, Input } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { JobModel } from '/@/api/monitor/model/jobModel';

  interface DataModel {
    form: JobModel;
  }

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
    },
    emits: ['onRefresh', 'register'],
    setup() {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
      });

      const [register] = useModalInner((row: JobModel) => {
        myData.form = row;
      });

      const getMisfirePolicy = computed<string>(() => {
        console.log(myData.form.misfirePolicy);
        if (myData.form.misfirePolicy == 0) {
          return '默认策略';
        } else if (myData.form.misfirePolicy == 1) {
          return '立即执行';
        } else if (myData.form.misfirePolicy == 2) {
          return '执行一次';
        } else if (myData.form.misfirePolicy == 3) {
          return '放弃执行';
        } else {
          return '';
        }
      });

      const { filterOption } = useSelect();
      return {
        filterOption,
        ...toRefs(myData),
        register,
        formRef,
        getMisfirePolicy,
      };
    },
  });
</script>
