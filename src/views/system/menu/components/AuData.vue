<template>
  <BasicModal v-bind="$attrs" title="菜单权限" width="700px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form2">
      <FormItem label="上级菜单" name="parentId">
        <TreeSelect
          showSearch
          allowClear
          placeholder="请选择上级菜单"
          :value="form.parentId"
          :treeData="menuOptions"
          :replaceFields="{
            label: 'menuName',
            value: 'menuId',
            children: 'children',
          }"
          :onSelect="onTreeSelect"
        />
      </FormItem>
      <FormItem label="菜单类型" name="menuType">
        <RadioGroup v-model:value="form.menuType">
          <Radio value="M">目录</Radio>
          <Radio value="C">菜单</Radio>
          <Radio value="F">按钮</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="form.menuType === 'M' || form.menuType === 'C'" label="菜单图标" name="icon">
        <Input v-model:value="form.icon" placeholder="请输入菜单图标" />
      </FormItem>
      <div class="flex">
        <FormItem label="菜单名称" name="menuName" class="flex-1">
          <Input v-model:value="form.menuName" placeholder="请输入菜单名称" />
        </FormItem>
        <FormItem label="显示排序" name="orderNum" class="flex-1">
          <Input v-model:value="form.orderNum" placeholder="请输入显示排序" />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem
          v-if="form.menuType === 'M' || form.menuType === 'C'"
          label="是否为外链"
          name="isFrame"
          class="flex-1"
        >
          <RadioGroup v-model:value="form.isFrame">
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          v-if="form.menuType === 'M' || form.menuType === 'C'"
          label="路由地址"
          name="path"
          class="flex-1"
        >
          <Input v-model:value="form.path" placeholder="请输入路由地址" />
        </FormItem>
      </div>
      <div v-if="form.menuType === 'C' || form.menuType === 'F'" class="flex">
        <FormItem v-if="form.menuType === 'C'" label="组件路径" name="component" class="flex-1">
          <Input v-model:value="form.component" placeholder="请输入组件路径" />
        </FormItem>
        <FormItem label="权限标识" name="perms" class="flex-1 max-w-84">
          <Input v-model:value="form.perms" placeholder="请输入权限标识" />
        </FormItem>
      </div>
      <div v-if="form.menuType === 'M' || form.menuType === 'C'" class="flex">
        <FormItem label="显示状态" name="visible" class="flex-1">
          <RadioGroup v-model:value="form.visible">
            <Radio value="0">显示</Radio>
            <Radio value="1">隐藏</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="菜单状态" name="status" class="flex-1">
          <RadioGroup v-model:value="form.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </RadioGroup>
        </FormItem>
      </div>
      <FormItem v-if="form.menuType === 'C'" label="是否缓存" name="isCache">
        <RadioGroup v-model:value="form.isCache">
          <Radio value="0">是</Radio>
          <Radio value="1">否</Radio>
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
    TreeSelect,
    // Select,
    // SelectOption,
    RadioGroup,
    Radio,
    message,
  } from 'ant-design-vue';
  import { getMenu, updateMenu, addMenu, getRouteMenuList } from '/@/api/sys/menu';
  import { MenuModel } from '/@/api/sys/model/menuModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { handleTree } from '/@/utils';

  type FormModel = MenuModel;
  interface DataModel {
    form: FormModel;
    menuOptions: MenuModel[];
  }

  const rules = {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    orderNum: [
      { required: true, message: '显示排序不能为空', trigger: 'blur' },
      { pattern: /^-?[1-9]\d*$/, message: '只能输入整数', trigger: 'blur' },
    ],
    path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      TreeSelect,
      // Select,
      // SelectOption,
      RadioGroup,
      Radio,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {
          menuType: 'M',
        },
        menuOptions: [],
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: MenuModel) => {
        formRef.value.resetFields();
        getRouteMenuList().then((res) => {
          myData.menuOptions = handleTree(res, 'menuId');
        });
        myData.form = {
          menuType: 'M',
          isFrame: '1',
          visible: '0',
          status: '0',
          isCache: '0',
        };
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

      const onTreeSelect = (value: number) => {
        myData.form.parentId = value;
      };

      return {
        filterOption,
        rules,
        ...toRefs(myData),
        register,
        onSubmit,
        formRef,
        onTreeSelect,
      };
    },
  });
</script>
