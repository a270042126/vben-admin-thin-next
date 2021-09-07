<template>
  <PageWrapper contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="菜单名称" name="menuName">
          <Input
            v-model:value="queryParams.menuName"
            allowClear
            placeholder="请输入菜单名称"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="菜单状态" name="status">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择菜单状态"
            :allowClear="true"
            :onPressEnter="handleReload"
          >
            <SelectOption value="0">显示</SelectOption>
            <SelectOption value="1">隐藏</SelectOption>
          </Select>
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <div class="flex mb-4 mt-2">
        <a-button type="primary" class="mr-4" @click="handleEdit()">
          <Icon icon="ant-design:file-add-outlined" />添加</a-button
        >
        <a-button v-if="false" type="primary" class="ml-4" @click="handleExport()">
          <Icon icon="ant-design:vertical-align-bottom-outlined" />导出</a-button
        >
      </div>
      <BasicTable @register="registerTable">
        <template #icon="{ record }">
          <Icon :icon="record.icon" />
        </template>
        <template #status="{ record }">
          {{ record.status === '0' ? '正常' : '停用' }}
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
  import { Form, Input, Card, Popconfirm, message, Select, SelectOption } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import AuData from './components/AuData.vue';
  import { useModal } from '/@/components/Modal';
  import { BasicData } from '/@/api/model/baseModel';
  import { getRouteMenuList, delMenu, exportMenu } from '/@/api/sys/menu';
  import { MenuModel } from '/@/api/sys/model/menuModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download, handleTree, handleChildren } from '/@/utils';
  // import { getDicts } from '/@/api/sys/dict';
  // import { selectDictLabel, DictDataModel } from '/@/utils'

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
      Select,
      SelectOption,
      AuData,
    },
    setup() {
      const myData = reactive<DataModel>({
        queryParams: {},
      });

      const columns: BasicColumn[] = [
        { title: '菜单名称', dataIndex: 'menuName', width: 240 },
        { title: '菜单图标', dataIndex: 'icon', slots: { customRender: 'icon' }, width: 110 },
        { title: '权限标识', dataIndex: 'perms', width: 200 },
        { title: '路由地址', dataIndex: 'path', width: 110 },
        { title: '组件路径', dataIndex: 'component', width: 110 },
        { title: '菜单类型', dataIndex: 'menuType', width: 110 },
        { title: '菜单状态', dataIndex: 'status', slots: { customRender: 'status' }, width: 110 },
        { title: '排序', dataIndex: 'orderNum', width: 110 },
        { title: '备注', dataIndex: 'remark', width: 110 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, setLoading }] = useTable({
        columns: columns,
        rowKey: 'menuId',
        bordered: true,
        api: getRouteMenuList,
        showTableSetting: true,
        showIndexColumn: false,
        beforeFetch: () => {
          return myData.queryParams;
        },
        afterFetch: (val) => {
          const list = handleTree(val, 'menuId');
          handleChildren(list);
          return list;
        },
      });

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: MenuModel) => {
        if (row) {
          setModalProps1({ title: '修改菜单权限' });
        } else {
          row = {};
          setModalProps1({ title: '添加菜单权限' });
        }
        openModal1(true, row);
      };

      const handleExport = () => {
        setLoading(true);
        exportMenu(myData.queryParams)
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
      const handleDelete = (row: MenuModel) => {
        setLoading(false);
        const ids = row.menuId;
        delMenu(ids)
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
