<template>
  <BasicModal v-bind="$attrs" title="菜单权限" width="700px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form">
      <FormItem label="菜单名称" name="menuName">
        <Input v-model:value="form.menuName" placeholder="请输入菜单名称" />
      </FormItem>
      <FormItem label="父菜单ID" name="parentId">
        <Input v-model:value="form.parentId" placeholder="请输入父菜单ID" />
      </FormItem>
      <FormItem label="显示顺序" name="orderNum">
        <Input v-model:value="form.orderNum" placeholder="请输入显示顺序" />
      </FormItem>
      <FormItem label="路由地址" name="path">
        <Input v-model:value="form.path" placeholder="请输入路由地址" />
      </FormItem>
      <FormItem label="组件路径" name="component">
        <Input v-model:value="form.component" placeholder="请输入组件路径" />
      </FormItem>
      <FormItem label="是否为外链" name="isFrame">
        <Input v-model:value="form.isFrame" placeholder="请输入是否为外链" />
      </FormItem>
      <FormItem label="是否缓存" name="isCache">
        <Input v-model:value="form.isCache" placeholder="请输入是否缓存" />
      </FormItem>
      <!-- <FormItem label="菜单类型" name="menuType">
        <Select
          v-model:value="form.menuType"
          showSearch
          allowClear
          :filterOption="filterOption"
          placeholder="请选择菜单类型"
        >
          <SelectOption value="">
            请选择字典生成
          </SelectOption>
        </Select>
      </FormItem> -->
      <FormItem label="菜单状态" name="visible">
        <Input v-model:value="form.visible" placeholder="请输入菜单状态" />
      </FormItem>
      <!-- <FormItem label="菜单状态" name="status">
        <RadioGroup v-model:value="form.status">
          <Radio>
            请选择字典生成
          </Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem label="权限标识" name="perms">
        <Input v-model:value="form.perms" placeholder="请输入权限标识" />
      </FormItem>
      <FormItem label="菜单图标" name="icon">
        <Input v-model:value="form.icon" placeholder="请输入菜单图标" />
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
  import {
    Form,
    Input,
    Textarea,
    // Select,
    // SelectOption,
    // RadioGroup,
    // Radio,
    message,
  } from 'ant-design-vue';
  import { getMenu, updateMenu, addMenu } from '/@/api/sys/menu';
  import { MenuModel } from '/@/api/sys/model/menuModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  type FormModel = MenuModel;
  interface DataModel {
    form: FormModel;
  }

  const rules = {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      // Select,
      // SelectOption,
      // RadioGroup,
      // Radio,
      Textarea,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: MenuModel) => {
        myData.form = {};
        const id = data.menuId ? data.menuId : null;
        if (id) {
          changeLoading(true);
          getMenu(id)
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
        if (form.menuId) {
          updateMenu(form)
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
          addMenu(form)
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
