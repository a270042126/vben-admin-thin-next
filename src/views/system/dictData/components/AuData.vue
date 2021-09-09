<template>
  <BasicModal v-bind="$attrs" title="字典数据" width="700px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form2">
      <FormItem label="字典类型" name="dictType">
        <Input v-model:value="form.dictType" placeholder="请输入字典类型" disabled />
      </FormItem>
      <FormItem label="字典标签" name="dictLabel">
        <Input v-model:value="form.dictLabel" placeholder="请输入字典标签" />
      </FormItem>
      <FormItem label="字典键值" name="dictValue">
        <Input v-model:value="form.dictValue" placeholder="请输入字典键值" />
      </FormItem>
      <FormItem label="样式属性" name="cssClass">
        <Input v-model:value="form.cssClass" placeholder="请输入样式属性" />
      </FormItem>
      <FormItem label="回显样式" name="listClass">
        <Input v-model:value="form.listClass" placeholder="请输入回显样式" />
      </FormItem>
      <FormItem label="字典排序" name="dictSort">
        <Input v-model:value="form.dictSort" placeholder="请输入字典排序" />
      </FormItem>
      <FormItem label="状态" name="status">
        <RadioGroup v-model:value="form.status">
          <Radio value="0">正常</Radio>
          <Radio value="1">停用</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注" name="remark">
        <Textarea v-model:value="form.remark" placeholder="请输入备注" />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form, Input, RadioGroup, Radio, message, Textarea } from 'ant-design-vue';
  import { getData, updateData, addData } from '/@/api/sys/dictData';
  import { DictDataModel } from '/@/api/sys/model/dictModel';
  import { useSelect } from '/@/hooks/component/useSelect';

  type FormModel = DictDataModel;
  interface DataModel {
    form: FormModel;
  }

  const rules = {};

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      RadioGroup,
      Radio,
      Textarea,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: Recordable) => {
        formRef.value.resetFields();
        myData.form = {
          dictType: data.dict.dictType,
          status: '0',
        };
        const id = data.row && data.row.dictCode ? data.row.dictCode : null;
        if (id) {
          changeLoading(true);
          getData(id)
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
        if (form.dictCode) {
          updateData(form)
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
          addData(form)
            .then(() => {
              changeLoading(false);
              message.success('修改成功');
              context.emit('onRefresh');
              closeModal();
            })
            .catch(() => {
              changeLoading(false);
            });
        }
      };
      const { filterOption } = useSelect();
      return {
        filterOption,
        rules,
        ...toRefs(myData),
        register,
        onSubmit,
        formRef,
      };
    },
  });
</script>
