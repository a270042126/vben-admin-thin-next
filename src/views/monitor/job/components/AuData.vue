<template>
  <BasicModal
    v-bind="$attrs"
    title="定时任务调度"
    width="550px"
    @register="register"
    @ok="onSubmit"
  >
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form2">
      <div class="flex">
        <FormItem label="任务名称" name="jobName">
          <Input v-model:value="form.jobName" placeholder="请输入任务名称" />
        </FormItem>
        <FormItem label="任务分组" name="jobGroup">
          <Select v-model:value="form.jobGroup" placeholder="请输入任务分组" :allowClear="true">
            <SelectOption
              v-for="(item, key) in jobGroupOptions"
              :key="key"
              :value="item.dictValue"
              >{{ item.dictLabel }}</SelectOption
            >
          </Select>
        </FormItem>
      </div>
      <FormItem label="调用方法" name="invokeTarget">
        <Input v-model:value="form.invokeTarget" placeholder="请输入调用方法" />
      </FormItem>
      <div class="flex">
        <FormItem label="cron表达式" name="cronExpression">
          <Input v-model:value="form.cronExpression" placeholder="请输入cron表达式" />
        </FormItem>
        <FormItem label="是否并发" name="concurrent">
          <Switch
            :checked="form.concurrent === '0'"
            checkedChildren="允许"
            unCheckedChildren="禁止"
            :onChange="
              (val) => {
                handleConcurrentChange(val);
              }
            "
          />
        </FormItem>
      </div>
      <FormItem label="错误策略" name="misfirePolicy">
        <RadioGroup
          v-model:value="form.misfirePolicy"
          :options="[
            { label: '立即执行', value: '1' },
            { label: '执行一次', value: '2' },
            { label: '放弃执行', value: '3' },
          ]"
        />
      </FormItem>
      <FormItem label="状态" name="status">
        <RadioGroup v-model:value="form.status">
          <Radio value="0">立即执行</Radio>
          <Radio value="1">暂停</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    Form,
    Input,
    Select,
    SelectOption,
    RadioGroup,
    Radio,
    Switch,
    message,
  } from 'ant-design-vue';
  import { getJob, updateJob, addJob } from '/@/api/monitor/job';
  import { JobModel } from '/@/api/monitor/model/jobModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { getDicts } from '/@/api/sys/dict';
  import { DictDataModel } from '/@/api/sys/model/dictModel';
  type FormModel = JobModel;
  interface DataModel {
    form: FormModel;
    jobGroupOptions: DictDataModel[];
  }

  const rules = {
    jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
    invokeTarget: [{ required: true, message: '调用目标字符串不能为空', trigger: 'blur' }],
    cronExpression: [{ required: true, message: 'cron执行表达式不能为空', trigger: 'blur' }],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      Select,
      SelectOption,
      RadioGroup,
      Radio,
      Switch,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {
          status: '0',
          misfirePolicy: '1',
        },
        jobGroupOptions: [],
      });

      getDicts('sys_job_group').then((res) => {
        myData.jobGroupOptions = res;
      });

      const [register, { closeModal, changeLoading }] = useModalInner((data: JobModel) => {
        formRef.value.resetFields();
        myData.form = {
          status: '0',
          misfirePolicy: '1',
        };
        const id = data.jobId ? data.jobId : null;
        if (id) {
          changeLoading(true);
          getJob(id)
            .then((res) => {
              if (res) {
                myData.form = res;
              }
              changeLoading(false);
            })
            .catch(() => {
              changeLoading(false);
            });
        }
      });
      const onSubmit = async () => {
        const data = await formRef.value.validateFields();
        if (!data) {
          return;
        }
        changeLoading(true);
        const form = myData.form;
        if (form.jobId) {
          updateJob(form)
            .then(() => {
              changeLoading(false);
              message.success('更新成功');
              context.emit('onRefresh');
              closeModal();
            })
            .catch(() => {
              changeLoading(false);
            });
        } else {
          addJob(form)
            .then(() => {
              changeLoading(false);
              message.success('添加成功');
              context.emit('onRefresh');
              closeModal();
            })
            .catch(() => {
              changeLoading(false);
            });
        }
      };

      const handleConcurrentChange = (val: boolean) => {
        myData.form.concurrent = val ? '0' : '1';
      };

      const { filterOption } = useSelect();
      return {
        filterOption,
        rules,
        ...toRefs(myData),
        register,
        onSubmit,
        formRef,
        handleConcurrentChange,
      };
    },
  });
</script>
