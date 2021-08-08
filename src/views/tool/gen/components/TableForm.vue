<template>
  <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form">
    <FormItem label="表名称" name="tableName">
      <Input v-model:value="form.tableName" allowClear placeholder="请输入表名称" />
    </FormItem>
    <FormItem label="表描述" name="tableComment">
      <Input v-model:value="form.tableComment" allowClear placeholder="请输入表描述" />
    </FormItem>
    <FormItem label="实体名称" name="className">
      <Input v-model:value="form.className" allowClear placeholder="请输入实体名称" />
    </FormItem>
    <FormItem label="作者" name="functionAuthor">
      <Input v-model:value="form.functionAuthor" allowClear placeholder="请输入作者" />
    </FormItem>
    <FormItem label="备注" name="remark" style="width: 100%; max-width: 600px">
      <TextArea v-model:value="form.remark" allowClear placeholder="请输入备注" />
    </FormItem>
  </Form>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Form, Input } from 'ant-design-vue';
  import { GenTableModel } from '/@/api/tool/model/genModel';

  const rules = {
    tableName: [{ required: true, message: '请输入表名称' }],
    tableComment: [{ required: true, message: '请输入表描述' }],
    className: [{ required: true, message: '请输入实体名称' }],
    functionAuthor: [{ required: true, message: '请输入作者' }],
  };

  export default defineComponent({
    components: {
      Form,
      Input,
      TextArea: Input.TextArea,
      FormItem: Form.Item,
    },
    setup() {
      const form = ref<GenTableModel>({});
      return {
        form,
        rules,
      };
    },
  });
</script>
