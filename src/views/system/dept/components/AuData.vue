<template>
  <BasicModal v-bind="$attrs" title="部门" width="700px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form2">
      <FormItem label="上级部门" name="parentId">
        <TreeSelect
          showSearch
          allowClear
          placeholder="请选择上级菜单"
          :value="form.parentId"
          :treeData="deptOptions"
          :replaceFields="{
            label: 'deptName',
            value: 'deptId',
            children: 'children',
          }"
          :onSelect="onTreeSelect"
        />
      </FormItem>
      <div class="flex">
        <FormItem label="部门名称" name="deptName" class="flex-1">
          <Input v-model:value="form.deptName" placeholder="请输入部门名称" />
        </FormItem>
        <FormItem label="显示顺序" name="orderNum" class="flex-1">
          <Input v-model:value="form.orderNum" placeholder="请输入显示顺序" class="!w-full" />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="负责人" name="leader" class="flex-1">
          <Input v-model:value="form.leader" placeholder="请输入负责人" />
        </FormItem>
        <FormItem label="联系电话" name="phone" class="flex-1">
          <Input v-model:value="form.phone" placeholder="请输入联系电话" />
        </FormItem>
      </div>
      <div class="flex">
        <FormItem label="邮箱" name="email" class="flex-1">
          <Input v-model:value="form.email" placeholder="请输入邮箱" />
        </FormItem>
        <FormItem label="部门状态" name="status" class="flex-1">
          <RadioGroup v-model:value="form.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </RadioGroup>
        </FormItem>
      </div>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form, Input, RadioGroup, Radio, TreeSelect, message } from 'ant-design-vue';
  import { getDept, updateDept, addDept, getDeptList } from '/@/api/sys/dept';
  import { DeptModel } from '/@/api/sys/model/departModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { handleTree } from '/@/utils';

  type FormModel = DeptModel;
  interface DataModel {
    form: FormModel;
    deptOptions: DeptModel[];
  }

  const rules = {
    deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
    orderNum: [
      { required: true, message: '显示排序不能为空', trigger: 'blur' },
      { pattern: /^-?[1-9]\d*$/, message: '只能输入整数', trigger: 'blur' },
    ],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      RadioGroup,
      Radio,
      TreeSelect,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
        deptOptions: [],
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: DeptModel) => {
        formRef.value.resetFields();
        myData.form = {
          status: '0',
        };
        getDeptList().then((res) => {
          myData.deptOptions = handleTree(res as any, 'deptId');
        });
        const id = data.deptId ? data.deptId : null;
        if (id) {
          changeLoading(true);
          getDept(id)
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
        if (form.deptId) {
          updateDept(form)
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
          addDept(form)
            .then(() => {
              changeLoading(false);
              message.success('添加成功');
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

<style lang="less" scoped>
  .menu-form {
    ::v-deep .ant-form-item {
      display: flex;

      .ant-form-item-label {
        width: 100px;
      }
    }
  }
</style>
