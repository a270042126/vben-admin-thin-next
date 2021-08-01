<template>
  <BasicModal v-bind="$attrs" title="用户" width="700px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form">
      <FormItem label="用户昵称" name="nickName">
        <Input v-model:value="form.nickName" placeholder="请输入用户昵称" />
      </FormItem>
      <FormItem label="归属部门" name="departIds">
        <Cascader
          v-model:value="form.departIds"
          placeholder="请输入归属部门"
          :field-names="{ label: 'label', value: 'id', children: 'children' }"
          :options="departTree"
        />
      </FormItem>
      <FormItem label="手机号码" name="phonenumber">
        <Input v-model:value="form.phonenumber" placeholder="请输入手机号码" />
      </FormItem>
      <FormItem label="邮箱" name="email">
        <Input v-model:value="form.email" placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="用户名称" name="userName" v-if="!form.userId">
        <Input v-model:value="form.userName" placeholder="请输入用户名称" />
      </FormItem>
      <FormItem label="用户密码" name="password" v-if="!form.userId">
        <Input
          v-model:value="form.password"
          type="password"
          autocomplete
          placeholder="请输入用户密码"
        />
      </FormItem>
      <FormItem label="性别" name="sex">
        <Select v-model:value="form.sex" placeholder="请选择性别" :allowClear="true">
          <SelectOption value="0">男</SelectOption>
          <SelectOption value="1">女</SelectOption>
          <SelectOption value="3">未知</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="状态" name="status">
        <RadioGroup v-model:value="form.status">
          <Radio value="0">正常</Radio>
          <Radio value="1">停用</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="岗位" name="postIds">
        <Select
          v-model:value="form.postIds"
          mode="multiple"
          showSearch
          :filterOption="filterOption"
          placeholder="请选择岗位"
        >
          <SelectOption v-for="(item, key) in postOptions" :key="key" :value="item.postId">
            {{ item.postName }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem label="角色" name="roleIds">
        <Select
          v-model:value="form.roleIds"
          mode="multiple"
          showSearch
          :filterOption="filterOption"
          placeholder="请选择角色"
        >
          <SelectOption v-for="(item, key) in roleOptions" :key="key" :value="item.roleId">
            {{ item.roleName }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem label="备注" name="remark" style="width: 100%; max-width: 600px">
        <Textarea v-model:value="form.remark" placeholder="请输入备注" />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, watchEffect, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    Form,
    Input,
    Cascader,
    Select,
    SelectOption,
    RadioGroup,
    Radio,
    Textarea,
  } from 'ant-design-vue';
  import { useDepartStore } from '/@/store/modules/system/depart';
  import { DepartTreeModel } from '/@/api/sys/model/departModel';
  import { UserModel } from '/@/api/sys/model/userModel';
  import { RoleModel } from '/@/api/sys/model/roleModel';
  import { PostModel } from '/@/api/sys/model/postModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { getFathersById } from '/@/utils/index';
  import { getUser, addUser, updateUser } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  interface FormModel extends UserModel {
    departIds?: number[];
    postIds?: number[];
  }

  interface DataModel {
    form: FormModel;
    roleOptions: RoleModel[];
    postOptions: PostModel[];
  }

  const rules = {
    nickName: [{ required: true, message: '请输入用户昵称' }],
    userName: [{ required: true, message: '请输入用户名称' }],
    password: [{ required: true, message: '请输入用户密码' }],
    email: [
      { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确邮箱' },
    ],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      Cascader,
      Select,
      SelectOption,
      RadioGroup,
      Radio,
      Textarea,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const myData = reactive<DataModel>({
        form: {
          departIds: [],
          postIds: [],
          roleIds: [],
          status: '0',
        },
        roleOptions: [],
        postOptions: [],
      });
      const formRef = ref();
      const { filterOption } = useSelect();
      const departStore = useDepartStore();
      const departTree = computed<DepartTreeModel[]>(() => {
        return departStore.getDepartTree;
      });
      watchEffect(() => {
        const departIds = myData.form.departIds;
        if (departIds && departIds.length > 0) {
          myData.form.deptId = departIds[departIds.length - 1];
        } else {
          myData.form.deptId = null;
        }
      });

      const [register, { closeModal, changeLoading }] = useModalInner((data: UserModel) => {
        myData.form = {
          departIds: [],
          postIds: [],
          roleIds: [],
          status: '0',
        };
        const id = data.userId ? data.userId : null;
        getUser(id).then((res) => {
          myData.roleOptions = res.roles;
          myData.postOptions = res.posts;
          if (res.data) {
            myData.form = res.data;
            myData.form.postIds = res.postIds;
            myData.form.roleIds = res.roleIds;
            const departId = myData.form.deptId;
            if (departId) {
              myData.form.departIds = getFathersById(departId, departTree.value);
            }
          }
        });
      });

      const { notification } = useMessage();

      const onSubmit = async () => {
        changeLoading(true);
        const data = await formRef.value.validateFields();
        if (!data) {
          return;
        }
        const form = myData.form;
        if (form.userId) {
          await updateUser(form);
        } else {
          await addUser(form);
        }
        changeLoading(false);
        notification.success({
          message: '操作成功',
          duration: 3,
        });
        context.emit('onRefresh');
        closeModal();
      };

      return {
        rules,
        formRef,
        filterOption,
        departTree,
        onSubmit,
        register,
        ...toRefs(myData),
      };
    },
  });
</script>
