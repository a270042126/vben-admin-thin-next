<template>
  <PageWrapper contentClass="flex items-start">
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
  import { Form, Input, Card, Popconfirm, message } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import AuData from './components/AuData.vue';
  import { useModal } from '/@/components/Modal';
  import { BasicData } from '/@/api/model/baseModel';
  import { getRoleList, delRole, exportRole } from '/@/api/sys/role';
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
    },
    setup() {
      const myData = reactive<DataModel>({
        queryParams: {},
      });

      const columns: BasicColumn[] = [
        { title: '角色ID', dataIndex: 'roleId', width: 110 },
        { title: '角色名称', dataIndex: 'roleName', width: 110 },
        { title: '角色权限字符串', dataIndex: 'roleKey', width: 150 },
        { title: '显示顺序', dataIndex: 'roleSort', width: 110 },
        { title: '数据范围', dataIndex: 'dataScope', width: 110 },
        { title: '菜单树选择项是否关联显示', dataIndex: 'menuCheckStrictly', width: 250 },
        { title: '部门树选择项是否关联显示', dataIndex: 'deptCheckStrictly', width: 250 },
        {
          title: '角色状态',
          dataIndex: 'status',
          format: (text: string) => {
            return text == '0' ? '正常' : '停用';
          },
          width: 110,
        },
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

      const handleExport = () => {
        setLoading(true);
        exportRole(myData.queryParams)
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
      const handleDelete = (row: RoleModel) => {
        setLoading(false);
        const ids = row.roleId || getSelectRowKeys();
        delRole(ids)
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
