<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="系统模块" name="title">
          <Input
            v-model:value="queryParams.title"
            allowClear
            placeholder="请输入模块标题"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="业务类型" name="businessType">
          <Select
            v-model:value="queryParams.businessType"
            placeholder="请选择业务类型"
            :allowClear="true"
            :filterOption="filterOption"
            :onPressEnter="handleReload"
          >
            <SelectOption
              v-for="(item, key) in businessTypeOptions"
              :key="key"
              :value="item.dictValue"
            >
              {{ item.dictLabel }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem label="操作人员" name="operName">
          <Input
            v-model:value="queryParams.operName"
            allowClear
            placeholder="请输入操作人员"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="操作状态" name="status">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择操作状态"
            :allowClear="true"
            :onPressEnter="handleReload"
          >
            <SelectOption value="0">成功</SelectOption>
            <SelectOption value="1">失败</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="操作时间" name="operTime">
          <RangePicker v-model:value="daterangeOperTime" format="YYYY-MM-DD" />
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <div class="flex my-4">
        <Popconfirm
          v-if="hasPermission('system:operLog:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <Popconfirm
          v-if="hasPermission('system:operLog:remove')"
          title="您确定清空吗"
          @confirm="handleClean"
        >
          <a-button class="ml-4" type="primary" danger
            ><Icon icon="ic:outline-delete-outline" />清空</a-button
          >
        </Popconfirm>
        <a-button
          v-if="hasPermission('system:operLog:export')"
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
            <Popconfirm
              v-if="hasPermission('system:operLog:remove')"
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
  </PageWrapper>
</template>

<script lang="ts">
  import { usePermission } from '/@/hooks/web/usePermission';
  import { defineComponent, reactive, toRefs } from 'vue';
  import {
    Form,
    Input,
    Card,
    Popconfirm,
    message,
    Select,
    SelectOption,
    RangePicker,
  } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { BasicData } from '/@/api/model/baseModel';
  import { getOperLogList, delOperLog, exportOperLog, clean } from '/@/api/sys/operLog';
  import { OperLogModel } from '/@/api/sys/model/operLogModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { getDicts } from '/@/api/sys/dict';
  import { selectDictLabel, download } from '/@/utils';
  import { formatToDate } from '/@/utils/dateUtil';
  import { DictDataModel } from '/@/api/sys/model/dictModel';

  interface DataModel extends BasicData {
    // 操作时间时间范围
    daterangeOperTime: Date[];
    businessTypeOptions: DictDataModel[];
  }

  export default defineComponent({
    name: 'OperLog',
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
      RangePicker,
    },
    setup() {
      const { hasPermission } = usePermission();
      const myData = reactive<DataModel>({
        queryParams: {},
        loading: false,
        // 操作时间时间范围
        daterangeOperTime: [],
        businessTypeOptions: [],
      });

      const columns: BasicColumn[] = [
        { title: '系统模块', dataIndex: 'title', width: 110 },
        {
          title: '操作类型',
          dataIndex: 'businessType',
          width: 110,
          format: (text: string) => {
            return selectDictLabel(myData.businessTypeOptions, text);
          },
        },
        { title: '请求方式', dataIndex: 'requestMethod', width: 110 },
        { title: '操作人员', dataIndex: 'operName', width: 110 },
        { title: '主机地址', dataIndex: 'operIp', width: 110 },
        { title: '操作地点', dataIndex: 'operLocation', width: 110 },
        {
          title: '操作状态',
          dataIndex: 'status',
          width: 110,
          format: (text: string) => {
            return text == '0' ? '成功' : '失败';
          },
        },
        { title: '操作时间', dataIndex: 'operTime', width: 200 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'operId',
        bordered: true,
        api: getOperLogList,
        showTableSetting: true,
        clickToRowSelect: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          myData.queryParams.params = {};
          if (myData.daterangeOperTime && myData.daterangeOperTime.length > 0) {
            myData.queryParams.params['beginTime'] = formatToDate(myData.daterangeOperTime[0]);
            myData.queryParams.params['endTime'] = formatToDate(myData.daterangeOperTime[1]);
          }
          return myData.queryParams;
        },
      });

      getDicts('sys_oper_type').then((response) => {
        myData.businessTypeOptions = response;
      });

      const handleExport = () => {
        setLoading(true);
        exportOperLog(myData.queryParams)
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
      const handleDelete = (row: OperLogModel) => {
        setLoading(true);
        const ids = row.operId || getSelectRowKeys();
        delOperLog(ids)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(() => {
            setLoading(false);
          });
      };
      const handleClean = () => {
        setLoading(true);
        clean()
          .then(() => {
            message.success('清空成功');
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
        handleDelete,
        handleReload,
        registerTable,
        ...toRefs(myData),
        resetQuery,
        filterOption,
        handleClean,
      };
    },
  });
</script>
