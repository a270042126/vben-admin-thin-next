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
          <Checkbox @change="handleCheckedTreeNodeAll">全选/不全选</Checkbox>
          <Checkbox :checked="!checkStrictly" @change="handleCheckedTreeConnect">父子联动</Checkbox>
        </div>
        <div class="tree">
          <Tree
            ref="menuRef"
            checkable
            :tree-data="menuTree"
            :checkedKeys="checkedKeys"
            :checkStrictly="checkStrictly"
            :replaceFields="{ children: 'children', title: 'label', key: 'id' }"
            :onCheck="onCheck"
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
  import { getTreeSelect, roleMenuTreeSelect } from '/@/api/sys/menu';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { MenuTreeModel } from '/@/api/sys/model/menuModel';
  import { findPnodeId } from '/@/utils';

  interface FormModel extends RoleModel {
    menuIds?: number[];
  }
  interface DataModel {
    form: FormModel;
    menuTree: MenuTreeModel[];
    allTreeKeys: number[];
    checkedKeys: number[];
    checkStrictly: boolean;
  }

  const rules = {
    roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
    roleKey: [{ required: true, message: '角色权限字符串不能为空', trigger: 'blur' }],
    roleSort: [
      { required: true, message: '显示顺序不能为空', trigger: 'blur' },
      { pattern: /^-?[1-9]\d*$/, message: '只能输入整数', trigger: 'blur' },
    ],
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
      const menuRef = ref();
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
        menuTree: [],
        allTreeKeys: [],
        checkedKeys: [],
        checkStrictly: false,
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: RoleModel) => {
        formRef.value.resetFields();
        myData.form = {};
        myData.checkedKeys = [];
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
          roleMenuTreeSelect(id).then((res) => {
            myData.menuTree = res.menus;
            const keys: number[] = [];
            setAllKeys(myData.menuTree, keys);
            myData.allTreeKeys = keys;
            // 移除父类
            let keys2: number[] = [];
            res.checkedKeys.map((id) => {
              const parentIds = findPnodeId(myData.menuTree, id) as number[];
              keys2 = keys2.concat(parentIds);
            });
            myData.checkedKeys = res.checkedKeys.filter((a) => {
              let flag = true;
              keys2.some((b) => {
                if (a === b) {
                  flag = false;
                  return true;
                }
              });
              return flag;
            });
          });
        } else {
          getTreeSelect().then((res) => {
            myData.menuTree = res;
            const keys = [];
            setAllKeys(myData.menuTree, keys);
            myData.allTreeKeys = keys;
          });
        }
      });

      const setAllKeys = (items: MenuTreeModel[], keys: number[]) => {
        items.map((item) => {
          keys.push(item.id);
          if (item.children) {
            setAllKeys(item.children, keys);
          }
        });
      };

      const onCheck = (val: number[]) => {
        myData.checkedKeys = val;
      };

      const handleCheckedTreeNodeAll = (val: ChangeEvent) => {
        if (val.target.checked) {
          myData.checkedKeys = myData.allTreeKeys;
        } else {
          myData.checkedKeys = [];
        }
      };

      const handleCheckedTreeConnect = () => {
        myData.checkStrictly = !myData.checkStrictly;
      };

      // 所有菜单节点数据
      const getMenuAllCheckedKeys = () => {
        let keys: number[] = [];
        myData.checkedKeys.map((id) => {
          const parentIds = findPnodeId(myData.menuTree, id) as number[];
          keys = keys.concat(parentIds);
        });
        keys = keys.concat(myData.checkedKeys);
        keys = Array.from(new Set(keys));
        return keys;
      };

      const onSubmit = async () => {
        const data = await formRef.value.validateFields();
        if (!data) {
          return;
        }
        changeLoading(true);
        const form = myData.form;
        form.menuIds = getMenuAllCheckedKeys();
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
        menuRef,
        formRef,
        filterOption,
        rules,
        ...toRefs(myData),
        register,
        onSubmit,
        handleCheckedTreeNodeAll,
        handleCheckedTreeConnect,
        onCheck,
      };
    },
  });
</script>

<style lang="less" scoped>
  .tree {
    margin: 10px 0;
    border: 1px solid #d9d9d9;
    min-height: 100px;
  }
</style>
