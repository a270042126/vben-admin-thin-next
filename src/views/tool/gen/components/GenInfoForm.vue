<template>
  <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form">
    <FormItem label="生产模板" name="tplCategory">
      <Select v-model:value="form.tplCategory" placeholder="请选择模板" :allowClear="true">
        <SelectOption value="crud">单表（增删改查）</SelectOption>
        <SelectOption value="tree">树表（增删改查）</SelectOption>
        <SelectOption value="sub">主子表（增删改查）</SelectOption>
      </Select>
    </FormItem>
    <FormItem label="生成包路径" name="packageName">
      <Input v-model:value="form.packageName" allowClear placeholder="请输入生成包路径" />
    </FormItem>
    <FormItem label="生成模块名" name="moduleName">
      <Input v-model:value="form.moduleName" allowClear placeholder="请输入生成模块名" />
    </FormItem>
    <FormItem label="生成业务名" name="businessName">
      <Input v-model:value="form.businessName" allowClear placeholder="请输入生成业务名" />
    </FormItem>
    <FormItem label="生成功能名" name="functionName">
      <Input v-model:value="form.functionName" allowClear placeholder="请输入生成功能名" />
    </FormItem>
    <FormItem label="上级菜单" name="parentMenuId">
      <Cascader
        v-model:value="form.parentMenuIds"
        placeholder="请选择上级菜单"
        :field-names="{ label: 'menuName', value: 'menuId', children: 'children' }"
        :options="menuOptions"
      />
    </FormItem>
    <!-- <FormItem label="生成代码方式" name="functionAuthor">
      <Input v-model:value="form.functionAuthor" allowClear placeholder="请输入作者" />
    </FormItem> -->
  </Form>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';
  import { Form, Input, Select, SelectOption, Cascader } from 'ant-design-vue';
  import { GenTableModel } from '/@/api/tool/model/genModel';

  const rules = {
    tplCategory: [{ required: true, message: '请选择生产模板' }],
    packageName: [{ required: true, message: '请输入生成包路径' }],
    moduleName: [{ required: true, message: '请输入生成模块名' }],
    businessName: [{ required: true, message: '请输入生成业务名' }],
    functionName: [{ required: true, message: '请选择生成功能名' }],
  };

  export default defineComponent({
    components: {
      Form,
      Input,
      Select,
      SelectOption,
      Cascader,
      FormItem: Form.Item,
    },
    setup() {
      const form = ref<GenTableModel>({});
      watchEffect(() => {
        const ids = form.value.parentMenuIds;
        if (ids && ids.length > 0) {
          form.value.parentMenuId = ids[ids.length - 1];
        } else {
          form.value.parentMenuId = null;
        }
      });
      const menuOptions = ref([]);
      return {
        form,
        menuOptions,
        rules,
      };
    },
  });
</script>
