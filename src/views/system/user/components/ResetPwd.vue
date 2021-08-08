<template>
  <BasicModal
    v-bind="$attrs"
    title="重置密码"
    width="400px"
    :minHeight="50"
    @register="register"
    @ok="onSubmit"
  >
    <Form
      :model="form"
      :rules="rules"
      ref="formRef"
      layout="horizontal"
      class="m-form"
      style="margin-top: 40px"
    >
      <FormItem label="密码" name="password">
        <InputPassword v-model:value="form.password" placeholder="请输入密码" autocomplete />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form, InputPassword, message } from 'ant-design-vue';
  import { UserModel } from '/@/api/sys/model/userModel';
  import { resetPwd } from '/@/api/sys/user';

  const rules = {
    passwrod: [{ required: true, message: '请输入密码' }],
  };
  export default defineComponent({
    components: { BasicModal, Form, FormItem: Form.Item, InputPassword },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const form = ref<UserModel>({
        userId: null,
        password: null,
      });
      const formRef = ref();
      const [register, { closeModal, changeLoading }] = useModalInner((data: UserModel) => {
        if (data) {
          form.value = {
            userId: data.userId,
            password: null,
          };
        }
      });

      const onSubmit = async () => {
        const data = await formRef.value.validateFields();
        if (!data) {
          return;
        }
        changeLoading(true);
        resetPwd(form.value)
          .then(() => {
            changeLoading(false);
            message.success('重置密码');
            context.emit('onRefresh');
            closeModal();
          })
          .catch(() => {
            changeLoading(false);
          });
      };
      return {
        formRef,
        form,
        rules,
        register,
        onSubmit,
      };
    },
  });
</script>
