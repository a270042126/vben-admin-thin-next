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
        <FormItem label="父菜单ID" name="parentId">
          <Input
            v-model:value="queryParams.parentId"
            allowClear
            placeholder="请输入父菜单ID"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="显示顺序" name="orderNum">
          <Input
            v-model:value="queryParams.orderNum"
            allowClear
            placeholder="请输入显示顺序"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="路由地址" name="path">
          <Input
            v-model:value="queryParams.path"
            allowClear
            placeholder="请输入路由地址"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="组件路径" name="component">
          <Input
            v-model:value="queryParams.component"
            allowClear
            placeholder="请输入组件路径"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="是否为外链" name="isFrame">
          <Input
            v-model:value="queryParams.isFrame"
            allowClear
            placeholder="请输入是否为外链"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="是否缓存" name="isCache">
          <Input
            v-model:value="queryParams.isCache"
            allowClear
            placeholder="请输入是否缓存"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="菜单状态" name="visible">
          <Input
            v-model:value="queryParams.visible"
            allowClear
            placeholder="请输入菜单状态"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="权限标识" name="perms">
          <Input
            v-model:value="queryParams.perms"
            allowClear
            placeholder="请输入权限标识"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="菜单图标" name="icon">
          <Input
            v-model:value="queryParams.icon"
            allowClear
            placeholder="请输入菜单图标"
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
  import { getMenuList, delMenu, exportMenu } from '/@/api/sys/menu';
  import { MenuModel } from '/@/api/sys/model/menuModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  // import { getDicts } from '/@/api/sys/dict';
  // import { selectDictLabel, DictDataModel } from '/@/utils'
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
      // Select,
      // SelectOption,
      AuData,
    },
    setup() {
      const myData = reactive<DataModel>({
        queryParams: {},
      });

      const columns: BasicColumn[] = [
        { title: '菜单ID', dataIndex: 'menuId', width: 110 },
        { title: '菜单名称', dataIndex: 'menuName', width: 110 },
        { title: '父菜单ID', dataIndex: 'parentId', width: 110 },
        { title: '显示顺序', dataIndex: 'orderNum', width: 110 },
        { title: '路由地址', dataIndex: 'path', width: 110 },
        { title: '组件路径', dataIndex: 'component', width: 110 },
        { title: '是否为外链', dataIndex: 'isFrame', width: 110 },
        { title: '是否缓存', dataIndex: 'isCache', width: 110 },
        { title: '菜单类型', dataIndex: 'menuType', width: 110 },
        { title: '菜单状态', dataIndex: 'visible', width: 110 },
        { title: '菜单状态', dataIndex: 'status', width: 110 },
        { title: '权限标识', dataIndex: 'perms', width: 110 },
        { title: '菜单图标', dataIndex: 'icon', width: 110 },
        { title: '备注', dataIndex: 'remark', width: 110 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'menuId',
        bordered: true,
        api: getMenuList,
        showTableSetting: true,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
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
        const ids = row.menuId || getSelectRowKeys();
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
