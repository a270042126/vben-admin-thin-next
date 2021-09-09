<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="字典名称" name="dictName">
          <Input
            v-model:value="queryParams.dictName"
            allowClear
            placeholder="请输入字典名称"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="字典类型" name="dictType">
          <Input
            v-model:value="queryParams.dictType"
            allowClear
            placeholder="请输入字典类型"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="状态" name="status">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
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
      <div class="flex my-4">
        <a-button
          v-if="hasPermission('system:type:add')"
          type="primary"
          class="mr-4"
          @click="handleEdit()"
        >
          <Icon icon="ant-design:file-add-outlined" />添加</a-button
        >
        <a-button
          v-if="hasPermission('system:type:remove')"
          type="primary"
          class="mr-4"
          @click="handleRefreshCache()"
        >
          <Icon icon="ant-design:retweet-outlined" />刷新缓存</a-button
        >
        <Popconfirm
          v-if="hasPermission('system:type:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <a-button
          v-if="hasPermission('system:type:export')"
          type="primary"
          class="ml-4"
          @click="handleExport()"
        >
          <Icon icon="ant-design:vertical-align-bottom-outlined" />导出</a-button
        >
      </div>
      <BasicTable @register="registerTable">
        <template #dictType="{ record }">
          <a-button type="link" class="text-btn" @click="gotoDictData(record.dictId)"
            >{{ record.dictType }}
          </a-button>
        </template>
        <template #status="{ record }">
          {{ record.status === '0' ? '正常' : '停用' }}
        </template>
        <template #action="{ record }">
          <div>
            <a-button
              v-if="hasPermission('system:type:edit')"
              type="link"
              class="text-btn"
              @click="handleEdit(record)"
            >
              <Icon icon="ant-design:edit-filled" />编辑
            </a-button>
            <Popconfirm
              v-if="hasPermission('system:type:remove')"
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
  import { getTypeList, delType, exportType, refreshCache } from '/@/api/sys/dict';
  import { DictTypeModel } from '/@/api/sys/model/dictModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download } from '/@/utils';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';

  type DataModel = BasicData;

  export default defineComponent({
    name: 'Dict',
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
        { title: '字典名称', dataIndex: 'dictName', width: 110 },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          slots: { customRender: 'dictType' },
          width: 200,
        },
        { title: '状态', dataIndex: 'status', slots: { customRender: 'status' }, width: 110 },
        { title: '备注', dataIndex: 'remark', width: 110 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'dictId',
        bordered: true,
        api: getTypeList,
        showTableSetting: true,
        clickToRowSelect: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
      });

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: DictTypeModel) => {
        if (row) {
          setModalProps1({ title: '修改字典类型' });
        } else {
          row = {};
          setModalProps1({ title: '添加字典类型' });
        }
        openModal1(true, row);
      };

      const handleExport = () => {
        setLoading(true);
        exportType(myData.queryParams)
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
      const handleDelete = (row: DictTypeModel) => {
        setLoading(false);
        const ids = row.dictId || getSelectRowKeys();
        delType(ids)
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

      const handleRefreshCache = () => {
        setLoading(true);
        refreshCache()
          .then(() => {
            message.success('刷新缓存成功');
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      };

      const go = useGo();
      const gotoDictData = (dictId: number) => {
        console.log(dictId);
        go(`${PageEnum.DICT_DATA_TABLE}${dictId}`);
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
        gotoDictData,
        handleRefreshCache,
      };
    },
  });
</script>
