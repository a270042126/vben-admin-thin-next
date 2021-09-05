<template>
  <BasicModal v-bind="$attrs" title="角色" width="600px" @register="register" @ok="onSubmit">
    <Form :model="form" ref="formRef" layout="horizontal" :label-col="{ span: 5 }">
      <FormItem label="角色名称" name="roleName">
        <Input v-model:value="form.roleName" placeholder="请输入角色名称" disabled />
      </FormItem>
      <FormItem label="权限字符" name="roleKey">
        <Input v-model:value="form.roleKey" placeholder="请输入角色权限字符串" disabled />
      </FormItem>
      <FormItem label="权限范围" name="dataScope">
        <Select
          v-model:value="form.dataScope"
          :options="dataScopeOptions"
          @change="dataScopeSelectChange"
        />
      </FormItem>
      <FormItem v-if="form.dataScope === '2'" label="数据分配">
        <div>
          <Checkbox @change="handleCheckedTreeNodeAll">全选/不全选</Checkbox>
        </div>
        <div class="tree">
          <Tree
            ref="deptTree1"
            checkable
            :tree-data="deptTree"
            :checkedKeys="checkedKeys"
            :replaceFields="{ children: 'children', title: 'label', key: 'id' }"
            :onCheck="onCheck"
          />
        </div>
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form, Input, message, Checkbox, Tree, Select } from 'ant-design-vue';
  import { RoleModel } from '/@/api/sys/model/roleModel';
  import { roleDeptTreeselect } from '/@/api/sys/dept';
  import { DepartTreeModel } from '/@/api/sys/model/departModel';
  import { dataScope } from '/@/api/sys/role';

  type FormModel = RoleModel;
  interface DataModel {
    form: FormModel;
    checkedKeys: number[];
    deptTree: DepartTreeModel[];
    allTreeKeys: number[];
  }

  const dataScopeOptions = [
    {
      value: '1',
      label: '全部数据权限',
    },
    {
      value: '2',
      label: '自定数据权限',
    },
    {
      value: '3',
      label: '本部门数据权限',
    },
    {
      value: '4',
      label: '本部门及以下数据权限',
    },
    {
      value: '5',
      label: '仅本人数据权限',
    },
  ];

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      Checkbox,
      Tree,
      Select,
    },
    setup() {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
        checkedKeys: [],
        deptTree: [],
        allTreeKeys: [],
      });

      const [register, { closeModal, changeLoading }] = useModalInner((data: RoleModel) => {
        myData.form = JSON.parse(JSON.stringify(data));
        myData.checkedKeys = [];
        changeLoading(true);
        roleDeptTreeselect(data.roleId!)
          .then((res) => {
            myData.deptTree = res.depts;
            const keys: number[] = [];
            setAllKeys(myData.deptTree, keys);
            myData.allTreeKeys = keys;
            myData.checkedKeys = res.checkedKeys;
            changeLoading(false);
          })
          .catch(() => {
            changeLoading(false);
          });
      });

      const setAllKeys = (items: DepartTreeModel[], keys: number[]) => {
        items.map((item) => {
          keys.push(item.id);
          if (item.children) {
            setAllKeys(item.children, keys);
          }
        });
      };

      const handleCheckedTreeNodeAll = (val: ChangeEvent) => {
        if (val.target.checked) {
          myData.checkedKeys = myData.allTreeKeys;
        } else {
          myData.checkedKeys = [];
        }
      };

      const onCheck = (val: number[]) => {
        myData.checkedKeys = val;
      };

      const dataScopeSelectChange = (val: string) => {
        if (val !== '2') {
          myData.checkedKeys = [];
        }
      };

      const onSubmit = () => {
        myData.form.deptIds = myData.checkedKeys;
        changeLoading(true);
        dataScope(myData.form)
          .then(() => {
            changeLoading(false);
            message.success('更新成功');
            closeModal();
          })
          .catch(() => {
            changeLoading(false);
          });
      };

      return {
        ...toRefs(myData),
        handleCheckedTreeNodeAll,
        formRef,
        register,
        onSubmit,
        onCheck,
        dataScopeOptions,
        dataScopeSelectChange,
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
