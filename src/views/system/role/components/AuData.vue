<template>
  <BasicModal v-bind="$attrs" title="角色" width="700px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form">
      <FormItem label="角色名称" name="roleName">
        <Input v-model:value="form.roleName" placeholder="请输入角色名称" />
      </FormItem>
      <FormItem label="角色权限字符串" name="roleKey">
        <Input v-model:value="form.roleKey" placeholder="请输入角色权限字符串" />
      </FormItem>
      <FormItem label="显示顺序" name="roleSort">
        <Input v-model:value="form.roleSort" placeholder="请输入显示顺序" />
      </FormItem>
      <FormItem label="数据范围" name="dataScope">
        <Input v-model:value="form.dataScope" placeholder="请输入数据范围" />
      </FormItem>
      <FormItem label="菜单树选择项是否关联显示" name="menuCheckStrictly">
        <!-- <Input
          v-model:value="form.menuCheckStrictly"
          placeholder="请输入菜单树选择项是否关联显示"
        /> -->
      </FormItem>
      <FormItem label="部门树选择项是否关联显示" name="deptCheckStrictly">
        <!-- <Input
          v-model:value="form.deptCheckStrictly"
          placeholder="请输入部门树选择项是否关联显示"
        /> -->
      </FormItem>
      <!-- <FormItem label="角色状态" name="status">
        <RadioGroup v-model:value="form.status">
          <Radio>
            请选择字典生成
          </Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem label="删除标志" name="delFlag">
        <Input v-model:value="form.delFlag" placeholder="请输入删除标志" />
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
  import { Form, Input, Textarea, message } from 'ant-design-vue';
  import { getRole, updateRole, addRole } from '/@/api/sys/role';
  import { RoleModel } from '/@/api/sys/model/roleModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  // import { getDicts } from '/@/api/sys/dict';
  // import {  DictDataModel } from '/@/utils'
  type FormModel = RoleModel;
  interface DataModel {
    form: FormModel;
  }

  const rules = {
    roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
    roleKey: [{ required: true, message: '角色权限字符串不能为空', trigger: 'blur' }],
    roleSort: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '角色状态不能为空', trigger: 'blur' }],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      Textarea,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: RoleModel) => {
        myData.form = {};
        const id = data.roleId ? data.roleId : null;
        if (id) {
          changeLoading(true);
          getRole(id)
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
        if (form.roleId) {
          updateRole(form)
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
          addRole(form)
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
      };
    },
  });
</script>
