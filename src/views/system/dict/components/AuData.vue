<template>
  <BasicModal v-bind="$attrs" title="字典类型" width="600px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form2">
      <FormItem label="字典名称" name="dictName">
        <Input v-model:value="form.dictName" placeholder="请输入字典名称" />
      </FormItem>
      <FormItem label="字典类型" name="dictType">
        <Input v-model:value="form.dictType" placeholder="请输入字典类型" />
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
  import { Form, Input, Textarea, RadioGroup, Radio, message } from 'ant-design-vue';
  import { getType, updateType, addType } from '/@/api/sys/dict';
  import { DictTypeModel } from '/@/api/sys/model/dictModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  type FormModel = DictTypeModel;
  interface DataModel {
    form: FormModel;
  }

  const rules = {
    dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
    dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      Textarea,
      RadioGroup,
      Radio,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: DictTypeModel) => {
        formRef.value.resetFields();
        myData.form = {
          status: '0',
        };
        const id = data.dictId ? data.dictId : null;
        if (id) {
          changeLoading(true);
          getType(id + '')
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
        if (form.dictId) {
          updateType(form)
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
          addType(form)
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
