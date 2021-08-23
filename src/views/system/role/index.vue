<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="角色名称" name="roleName">
          <Input
            v-model:value="queryParams.roleName"
            allowClear
            placeholder="请输入角色名称"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <div class="flex mb-4 mt-2">
        <a-button type="primary" class="mr-4" @click="handleEdit()">
          <Icon icon="ant-design:file-add-outlined" />添加</a-button
        >
        <Popconfirm title="您确定删除吗" @confirm="handleDelete">
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <a-button type="primary" class="ml-4" @click="handleExport()">
          <Icon icon="ant-design:vertical-align-bottom-outlined" />导出</a-button
        >
      </div>
      <BasicTable @register="registerTable">
        <template #status="{ record }">
          <Switch
            :checked="record.status === '0'"
            :onChange="
              (val) => {
                handleStatusChange(record, val);
              }
            "
          />
        </template>
        <template #action="{ record }">
          <div>
            <a-button type="link" class="text-btn" @click="handleEdit(record)">
              <Icon icon="ant-design:edit-filled" />编辑
            </a-button>
            <Popconfirm title="您确定删除吗" @confirm="handleDelete(record)">
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
  import { defineComponent, reactive, toRefs } from 'vue';
  import { Form, Input, Card, Popconfirm, Switch, message } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import AuData from './components/AuData.vue';
  import { useModal } from '/@/components/Modal';
  import { BasicData } from '/@/api/model/baseModel';
  import { getRoleList, delRole, changeStatus, exportRole } from '/@/api/sys/role';
  import { RoleModel } from '/@/api/sys/model/roleModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download } from '/@/utils';

  type DataModel = BasicData;

  export default defineComponent({
    components: {
      PageWrapper,
      Form,
      FormItem: Form.Item,
      Input,
      Card,
      BasicTable,
      Icon,
      Popconfirm,
      AuData,
      Switch,
    },
    setup() {
      const myData = reactive<DataModel>({
        queryParams: {},
        loading: false,
      });

      const columns: BasicColumn[] = [
        { title: '角色ID', dataIndex: 'roleId', width: 110 },
        { title: '角色名称', dataIndex: 'roleName', width: 110 },
        { title: '权限字符', dataIndex: 'roleKey', width: 150 },
        { title: '显示顺序', dataIndex: 'roleSort', width: 110 },
        { title: '角色状态', dataIndex: 'status', slots: { customRender: 'status' }, width: 200 },
        { title: '备注', dataIndex: 'remark', width: 110 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'roleId',
        bordered: true,
        api: getRoleList,
        showTableSetting: true,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
      });

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: RoleModel) => {
        if (row) {
          setModalProps1({ title: '修改角色信息' });
        } else {
          row = {};
          setModalProps1({ title: '添加角色信息' });
        }
        openModal1(true, row);
      };

      const handleStatusChange = (row: RoleModel, val: boolean) => {
        row.status = val ? '0' : '1';
        setLoading(true);
        changeStatus(row)
          .then(() => {
            setLoading(false);
            reload();
          })
          .catch(() => {
            row.status = !val ? '0' : '1';
            setLoading(false);
          });
      };

      const handleExport = () => {
        myData.loading = true;
        exportRole(myData.queryParams)
          .then((res) => {
            myData.loading = false;
            download(res);
          })
          .catch(() => {
            myData.loading = false;
          });
      };
      const handleReload = () => {
        reload({ page: 1 });
      };
      const handleDelete = (row: RoleModel) => {
        myData.loading = true;
        const ids = row.roleId || getSelectRowKeys();
        delRole(ids)
          .then(() => {
            message.success('删除成功');
            reload();
            myData.loading = false;
          })
          .catch(() => {
            myData.loading = false;
          });
      };
      const resetQuery = () => {
        myData.queryParams = {};
        handleReload();
      };
      const { filterOption } = useSelect();
      return {
        handleStatusChange,
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
