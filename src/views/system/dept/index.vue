<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="部门名称" name="deptName">
          <Input
            v-model:value="queryParams.deptName"
            allowClear
            placeholder="请输入部门名称"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="部门状态" name="status">
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
          v-if="hasPermission('system:dept:add')"
          type="primary"
          class="mr-4"
          @click="handleEdit()"
        >
          <Icon icon="ant-design:file-add-outlined" />添加</a-button
        >
        <Popconfirm
          v-if="hasPermission('system:dept:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <a-button
          v-if="hasPermission('system:dept:export')"
          type="primary"
          class="ml-4"
          @click="handleExport()"
        >
          <Icon icon="ant-design:vertical-align-bottom-outlined" />导出</a-button
        >
      </div>
      <BasicTable @register="registerTable">
        <template #action="{ record }">
          <div>
            <a-button
              v-if="hasPermission('system:dept:edit')"
              type="link"
              class="text-btn"
              @click="handleEdit(record)"
            >
              <Icon icon="ant-design:edit-filled" />编辑
            </a-button>
            <Popconfirm
              v-if="hasPermission('system:dept:remove')"
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
  import { getDeptList, delDept, exportDept } from '/@/api/sys/dept';
  import { DeptModel } from '/@/api/sys/model/departModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download, handleTree, handleChildren } from '/@/utils';

  type DataModel = BasicData;

  export default defineComponent({
    name: 'Dept',
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
        { title: '部门名称', dataIndex: 'deptName', width: 200 },
        { title: '部门状态', dataIndex: 'status', width: 110 },
        { title: '显示顺序', dataIndex: 'orderNum', width: 110 },
        { title: '创建时间', dataIndex: 'createTime', width: 200 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'deptId',
        bordered: true,
        api: getDeptList,
        showTableSetting: true,
        showIndexColumn: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
        afterFetch: (val) => {
          const list = handleTree(val, 'deptId');
          handleChildren(list);
          return list;
        },
      });

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: DeptModel) => {
        if (row) {
          setModalProps1({ title: '修改部门' });
        } else {
          row = {};
          setModalProps1({ title: '添加部门' });
        }
        openModal1(true, row);
      };

      const handleExport = () => {
        setLoading(true);
        exportDept(myData.queryParams)
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
      const handleDelete = (row: DeptModel) => {
        setLoading(false);
        const ids = row.deptId || getSelectRowKeys();
        delDept(ids)
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
