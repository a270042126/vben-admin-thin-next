<template>
  <BasicModal v-bind="$attrs" title="角色" width="600px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" :label-col="{ span: 5 }">
      <FormItem label="角色名称" name="roleName">
        <Input v-model:value="form.roleName" placeholder="请输入角色名称" />
      </FormItem>
      <FormItem label="权限字符" name="roleKey">
        <Input v-model:value="form.roleKey" placeholder="请输入角色权限字符串" />
      </FormItem>
      <FormItem label="显示顺序" name="roleSort">
        <Input v-model:value="form.roleSort" placeholder="请输入显示顺序" type="number" />
      </FormItem>
      <FormItem label="菜单权限">
        <div>
          <Checkbox @change="handleCheckedTreeExpand">收缩/展开</Checkbox>
          <Checkbox @change="handleCheckedTreeNodeAll">全选/不全选</Checkbox>
        </div>
        <div class="tree">
          <Tree
            checkable
            :expandedKeys="expandedKeys"
            :tree-data="menuTree"
            :replaceFields="{ children: 'children', title: 'label', key: 'id' }"
          />
        </div>
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
  import { Form, Input, Textarea, message, Checkbox, Tree } from 'ant-design-vue';
  import { getRole, updateRole, addRole } from '/@/api/sys/role';
  import { RoleModel } from '/@/api/sys/model/roleModel';
  import { getTreeSelect } from '/@/api/sys/menu';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { MenuTreeModel } from '/@/api/sys/model/menuModel';
  type FormModel = RoleModel;
  interface DataModel {
    form: FormModel;
    menuTree: MenuTreeModel[];
    expandedKeys: number[];
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
      Checkbox,
      Tree,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
        menuTree: [],
        expandedKeys: [],
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

        getTreeSelect().then((res) => {
          myData.menuTree = res;
        });
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

      const handleCheckedTreeExpand = (val: ChangeEvent) => {
        if (val.target.checked) {
          const list: number[] = [];
          myData.menuTree.map((item) => {
            list.push(item.id);
          });
          myData.expandedKeys = list;
        } else {
          myData.expandedKeys = [];
        }
      };

      const handleCheckedTreeNodeAll = (val: ChangeEvent) => {
        if (val.target.checked) {
          //
        } else {
          //
        }
      };

      const { filterOption } = useSelect();
      return {
        filterOption,
        rules,
        ...toRefs(myData),
        register,
        onSubmit,
        handleCheckedTreeExpand,
        handleCheckedTreeNodeAll,
      };
    },
  });
</script>

<style lang="less" scoped>
  .tree {
    margin: 10px 0;
    border: 1px solid #d9d9d9;
  }
</style>
