<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="字典名称" name="dictType">
          <Select
            v-model:value="queryParams.dictType"
            placeholder="请选择状态"
            :allowClear="true"
            :onPressEnter="handleReload"
          >
            <SelectOption v-for="(item, key) in typeOptions" :key="key" :value="item.dictType">
              {{ item.dictName }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem label="字段标签" name="dictLabel">
          <Input
            v-model:value="queryParams.dictLabel"
            allowClear
            placeholder="请输入字典标签"
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
      <div class="flex mb-4 mt-2">
        <a-button
          v-if="hasPermission('system:data:add')"
          type="primary"
          class="mr-4"
          @click="handleEdit()"
        >
          <Icon icon="ant-design:file-add-outlined" />添加</a-button
        >
        <Popconfirm
          v-if="hasPermission('system:data:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <a-button
          v-if="hasPermission('system:data:export')"
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
              v-if="hasPermission('system:data:edit')"
              type="link"
              class="text-btn"
              @click="handleEdit(record)"
            >
              <Icon icon="ant-design:edit-filled" />编辑
            </a-button>
            <Popconfirm
              v-if="hasPermission('system:data:remove')"
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
  import { defineComponent, reactive, toRefs, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { Form, Input, Card, Popconfirm, message, Select, SelectOption } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import AuData from './components/AuData.vue';
  import { useModal } from '/@/components/Modal';
  import { BasicData } from '/@/api/model/baseModel';
  import { getType, getTypeList } from '/@/api/sys/dict';
  import { getDataList, delData, exportData } from '/@/api/sys/dictData';
  import { DictDataModel, DictTypeModel } from '/@/api/sys/model/dictModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download } from '/@/utils';

  interface DataModel extends BasicData {
    dictType: DictTypeModel;
    typeOptions: DictTypeModel[];
  }

  export default defineComponent({
    name: 'DictItems',
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
      const route = useRoute();
      const dictId = computed<string>(() => {
        return route.params.dictId as string;
      });

      const myData = reactive<DataModel>({
        queryParams: {},
        loading: false,
        dictType: {},
        typeOptions: [],
      });

      const columns: BasicColumn[] = [
        { title: '字典便签', dataIndex: 'dictLabel', width: 110 },
        { title: '字典键值', dataIndex: 'dictValue', width: 110 },
        { title: '字典排序', dataIndex: 'dictSort', width: 110 },
        { title: '状态', dataIndex: 'status', slots: { customRender: 'status' }, width: 110 },
        { title: '备注', dataIndex: 'remark', width: 110 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'dictCode',
        bordered: true,
        api: getDataList,
        showTableSetting: true,
        immediate: false,
        clickToRowSelect: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
      });

      getType(dictId.value).then((res) => {
        myData.dictType = res;
        myData.queryParams.dictType = res.dictType;
        reload();
      });

      onMounted(() => {
        setLoading(true);
        getTypeList()
          .then((res) => {
            myData.typeOptions = res.rows;
            reload();
          })
          .catch(() => {
            setLoading(false);
          });
      });

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: DictDataModel) => {
        if (row) {
          setModalProps1({ title: '修改字典数据' });
        } else {
          row = {};
          setModalProps1({ title: '添加字典数据' });
        }
        const data = {
          row: row,
          dict: myData.dictType,
        };
        openModal1(true, data);
      };

      const handleExport = () => {
        setLoading(true);
        exportData(myData.queryParams)
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
      const handleDelete = (row: DictDataModel) => {
        setLoading(false);
        const ids = row.dictCode || getSelectRowKeys();
        delData(ids)
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
