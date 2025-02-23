<template>
  <PageWrapper>
    <card class="!mr-4 dep-tree">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="表名称" name="tableName">
          <Input v-model:value="queryParams.tableName" allowClear placeholder="请输入表名称" />
        </FormItem>
        <FormItem label="表描述" name="tableComment">
          <Input v-model:value="queryParams.tableComment" allowClear placeholder="请输入表描述" />
        </FormItem>
        <FormItem label="创建日期" name="dateRange">
          <RangePicker v-model:value="dateRange" />
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
      </Form>
      <div class="flex mb-4 mt-2">
        <a-button type="primary" class="mr-4" @click="importTable()">
          <Icon icon="ant-design:file-add-outlined" />导入</a-button
        >
        <Popconfirm title="您确定删除吗" @confirm="handleDelete">
          <a-button type="primary" danger>删除</a-button>
        </Popconfirm>
      </div>
      <BasicTable @register="registerTable">
        <template #action="{ record }">
          <div>
            <a-button type="link" class="text-btn" @click="download(record)"
              ><Icon icon="ant-design:download-outlined" />生成代码</a-button
            >
            <a-button type="link" class="text-btn" @click="handleEdit(record)"
              ><Icon icon="ant-design:edit-filled" />编辑</a-button
            >
            <Popconfirm title="您确定删除吗" @confirm="handleDelete(record)">
              <a-button type="link" danger class="text-btn"
                ><Icon icon="ic:outline-delete-outline" />删除</a-button
              >
            </Popconfirm>
          </div>
        </template>
      </BasicTable>
    </card>
    <SelectTable @register="register1" @onRefresh="reload" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Form, Input, Card, RangePicker, Popconfirm, message } from 'ant-design-vue';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { Icon } from '/@/components/Icon';
  import { BasicData } from '/@/api/model/baseModel';
  import { getGenTableList, deleteGenTable, batchGenCode } from '/@/api/tool/gen';
  import SelectTable from './components/SelectTable.vue';
  import { GenTableModel } from '/@/api/tool/model/genModel';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import bus from '/@/bus';
  import { downloadByData } from '/@/utils/file/download';
  interface DataModel extends BasicData {
    dateRange: Date[];
  }

  const columns: BasicColumn[] = [
    { title: '表名称', dataIndex: 'tableName', width: 110 },
    { title: '表描述', dataIndex: 'tableComment', width: 110 },
    { title: '实体', dataIndex: 'className', width: 110 },
    { title: '创建时间', dataIndex: 'createTime', width: 200 },
    { title: '更新时间', dataIndex: 'updateTime', width: 130 },
    { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
  ];

  export default defineComponent({
    name: 'Gen',
    components: {
      Form,
      Input,
      Card,
      FormItem: Form.Item,
      Icon,
      PageWrapper,
      RangePicker,
      BasicTable,
      SelectTable,
      Popconfirm,
    },
    setup() {
      const myData = reactive<DataModel>({
        dateRange: [],
        queryParams: {},
      });

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'tableId',
        bordered: true,
        api: getGenTableList,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
        showTableSetting: true,
        clickToRowSelect: false,
      });

      const [register1, { openModal: openModal1 }] = useModal();
      const importTable = () => {
        openModal1(true, 1);
      };

      const handleReload = () => {
        reload({ page: 1 });
      };

      bus.on('genTableRefresh', () => {
        reload();
      });

      const go = useGo();
      const handleEdit = (row: GenTableModel) => {
        go(`${PageEnum.EDIT_TABLE}${row.tableId}`);
      };
      const handleDelete = (row: GenTableModel) => {
        setLoading(false);
        const ids = row.tableId || getSelectRowKeys();
        deleteGenTable(ids)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(() => {
            setLoading(false);
          });
      };
      const download = (row: GenTableModel) => {
        const tables = row.tableName || '';
        batchGenCode(tables).then((res) => {
          downloadByData(res, '生成代码.zip');
        });
      };
      return {
        download,
        reload,
        handleReload,
        handleDelete,
        handleEdit,
        registerTable,
        importTable,
        register1,
        ...toRefs(myData),
      };
    },
  });
</script>
