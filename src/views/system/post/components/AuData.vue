<template>
  <BasicModal v-bind="$attrs" title="岗位信息" width="700px" @register="register" @ok="onSubmit">
    <Form :model="form" :rules="rules" ref="formRef" layout="horizontal" class="m-form2">
      <FormItem label="岗位编码" name="postCode">
        <Input v-model:value="form.postCode" placeholder="请输入岗位编码" />
      </FormItem>
      <FormItem label="岗位名称" name="postName">
        <Input v-model:value="form.postName" placeholder="请输入岗位名称" />
      </FormItem>
      <FormItem label="显示顺序" name="postSort">
        <Input v-model:value="form.postSort" placeholder="请输入显示顺序" />
      </FormItem>
      <FormItem label="状态" name="status">
        <RadioGroup v-model:value="form.status">
          <Radio value="0">正常</Radio>
          <Radio value="1">停用</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注" name="remark">
        <Textarea v-model:value="form.remark" placeholder="请输入显示顺序" />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form, Input, Textarea, RadioGroup, Radio, message } from 'ant-design-vue';
  import { getPost, updatePost, addPost } from '/@/api/sys/post';
  import { PostModel } from '/@/api/sys/model/postModel';
  import { useSelect } from '/@/hooks/component/useSelect';

  type FormModel = PostModel;
  interface DataModel {
    form: FormModel;
  }

  const rules = {
    postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
    postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
    postSort: [
      { required: true, message: '显示排序不能为空', trigger: 'blur' },
      { pattern: /^-?[1-9]\d*$/, message: '只能输入整数', trigger: 'blur' },
    ],
    status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  };

  export default defineComponent({
    components: {
      BasicModal,
      Form,
      Input,
      FormItem: Form.Item,
      RadioGroup,
      Radio,
      Textarea,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const formRef = ref();
      const myData = reactive<DataModel>({
        form: {},
      });
      const [register, { closeModal, changeLoading }] = useModalInner((data: PostModel) => {
        formRef.value.resetFields();
        myData.form = {
          status: '0',
        };
        const id = data.postId ? data.postId : null;
        if (id) {
          changeLoading(true);
          getPost(id)
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
        if (form.postId) {
          updatePost(form)
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
          addPost(form)
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
