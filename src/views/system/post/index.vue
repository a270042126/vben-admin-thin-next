<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="岗位编码" name="postCode">
          <Input
            v-model:value="queryParams.postCode"
            allowClear
            placeholder="请输入岗位编码"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="岗位名称" name="postName">
          <Input
            v-model:value="queryParams.postName"
            allowClear
            placeholder="请输入岗位名称"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="状态" name="status">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择部门状态"
            :allowClear="true"
            :onPressEnter="handleReload"
          >
            <SelectOption value="0">正常</SelectOption>
            <SelectOption value="1">停用</SelectOption>
          </Select>
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <div class="flex mb-4 mt-2">
        <a-button
          v-if="hasPermission('system:post:add')"
          type="primary"
          class="mr-4"
          @click="handleEdit()"
        >
          <Icon icon="ant-design:file-add-outlined" />添加</a-button
        >
        <Popconfirm
          v-if="hasPermission('system:post:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <a-button
          v-if="hasPermission('system:post:export')"
          type="primary"
          class="ml-4"
          @click="handleExport()"
        >
          <Icon icon="ant-design:vertical-align-bottom-outlined" />导出</a-button
        >
      </div>
      <BasicTable @register="registerTable">
        <template #status="{ record }">
          {{ record.status === '0' ? '正常' : '停用' }}
        </template>
        <template #action="{ record }">
          <div>
            <a-button
              v-if="hasPermission('system:post:edit')"
              type="link"
              class="text-btn"
              @click="handleEdit(record)"
            >
              <Icon icon="ant-design:edit-filled" />编辑
            </a-button>
            <Popconfirm
              v-if="hasPermission('system:post:remove')"
              title="您确定删除吗"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" danger class="text-btn">
                <Icon icon="ic:outline-delete-outline" />删除
              </a-button>
            </Popconfirm>
          </div>
        </template>
      </BasicTable>
    </card>
    <AuData @register="register1" @onRefresh="reload" />
  </PageWrapper>
</template>

<script lang="ts">
  import { usePermission } from '/@/hooks/web/usePermission';
  import { defineComponent, reactive, toRefs } from 'vue';
  import { Form, Input, Card, Popconfirm, message, Select, SelectOption } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import AuData from './components/AuData.vue';
  import { useModal } from '/@/components/Modal';
  import { BasicData } from '/@/api/model/baseModel';
  import { getPostList, delPost, exportPost } from '/@/api/sys/post';
  import { PostModel } from '/@/api/sys/model/postModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download } from '/@/utils';

  type DataModel = BasicData;

  export default defineComponent({
    name: 'Post',
    components: {
      PageWrapper,
      Form,
      FormItem: Form.Item,
      Input,
      Card,
      BasicTable,
      Icon,
      Popconfirm,
      Select,
      SelectOption,
      AuData,
    },
    setup() {
      const { hasPermission } = usePermission();
      const myData = reactive<DataModel>({
        queryParams: {},
        loading: false,
      });

      const columns: BasicColumn[] = [
        { title: '岗位编码', dataIndex: 'postCode', width: 110 },
        { title: '岗位名称', dataIndex: 'postName', width: 110 },
        { title: '显示顺序', dataIndex: 'postSort', width: 110 },
        { title: '状态', dataIndex: 'status', slots: { customRender: 'status' }, width: 110 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'postId',
        bordered: true,
        api: getPostList,
        showTableSetting: true,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
      });

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: PostModel) => {
        if (row) {
          setModalProps1({ title: '修改岗位信息' });
        } else {
          row = {};
          setModalProps1({ title: '添加岗位信息' });
        }
        openModal1(true, row);
      };

      const handleExport = () => {
        setLoading(true);
        exportPost(myData.queryParams)
          .then((res) => {
            setLoading(false);
            download(res);
          })
          .catch(() => {
            setLoading(false);
          });
      };
      const handleReload = () => {
        reload({ page: 1 });
      };
      const handleDelete = (row: PostModel) => {
        setLoading(false);
        const ids = row.postId || getSelectRowKeys();
        delPost(ids)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(() => {
            setLoading(false);
          });
      };
      const resetQuery = () => {
        myData.queryParams = {};
        handleReload();
      };
      const { filterOption } = useSelect();
      return {
        hasPermission,
        reload,
        handleExport,
        handleEdit,
        handleDelete,
        handleReload,
        registerTable,
        ...toRefs(myData),
        resetQuery,
        filterOption,
        register1,
      };
    },
  });
</script>
