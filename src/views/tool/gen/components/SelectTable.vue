<template>
  <BasicModal v-bind="$attrs" title="用户" width="730px" @register="register" @ok="onSubmit">
    <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
      <FormItem label="表名称" name="tableName">
        <Input v-model:value="queryParams.tableName" allowClear placeholder="请输入用户昵称" />
      </FormItem>
      <FormItem label="表描述" name="tableComment">
        <Input v-model:value="queryParams.tableComment" allowClear placeholder="请输入用户昵称" />
      </FormItem>
      <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
    </Form>
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { Form, Input } from 'ant-design-vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicData } from '/@/api/model/baseModel';
  import { getDbList, importTable } from '/@/api/tool/gen';
  import { useMessage } from '/@/hooks/web/useMessage';

  type DataModel = BasicData;

  const columns: BasicColumn[] = [
    { title: '表名称', dataIndex: 'tableName', width: 110 },
    { title: '表描述', dataIndex: 'tableComment', width: 110 },
    { title: '创建时间', dataIndex: 'createTime', width: 200 },
    { title: '更新时间', dataIndex: 'updateTime', width: 130 },
  ];

  export default defineComponent({
    components: {
      BasicModal,
      BasicTable,
      Form,
      FormItem: Form.Item,
      Input,
    },
    emits: ['onRefresh', 'register'],
    setup(_, context) {
      const myData = reactive<DataModel>({
        queryParams: {},
      });

      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        columns: columns,
        rowKey: 'tableName',
        bordered: true,
        api: getDbList,
        immediate: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: (params: Recordable) => {
          myData.queryParams.pageNum = params.pageNum;
          return myData.queryParams;
        },
      });

      const [register, { closeModal, changeLoading }] = useModalInner(() => {
        reload();
      });

      const handleReload = () => {
        reload({ page: 1 });
      };

      const { notification } = useMessage();
      const onSubmit = () => {
        changeLoading(true);
        const tables = getSelectRowKeys ? getSelectRowKeys().join(',') : '';
        importTable(tables)
          .then(() => {
            changeLoading(false);
            notification.success({
              message: '更新成功',
              duration: 3,
            });
            context.emit('onRefresh');
          })
          .catch(() => {
            changeLoading(false);
          });
        closeModal();
      };
      return {
        handleReload,
        registerTable,
        columns,
        ...toRefs(myData),
        register,
        onSubmit,
        Form,
        Input,
      };
    },
  });
</script>
