<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="任务名称" name="jobName">
          <Input
            v-model:value="queryParams.jobName"
            allowClear
            placeholder="请输入任务名称"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="任务组名" name="jobGroup">
          <Input
            v-model:value="queryParams.jobGroup"
            allowClear
            placeholder="请输入任务组名"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="执行状态" name="status">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择执行状态"
            :allowClear="true"
            :onPressEnter="handleReload"
          >
            <SelectOption value="0">成功</SelectOption>
            <SelectOption value="1">失败</SelectOption>
          </Select>
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <div class="flex my-4">
        <Popconfirm
          v-if="hasPermission('monitor:log:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <Popconfirm
          v-if="hasPermission('monitor:log:remove')"
          title="您确定要清空吗"
          @confirm="handleClean"
        >
          <a-button type="primary" danger class="ml-4"
            ><Icon icon="ic:outline-delete-outline" />清空</a-button
          >
        </Popconfirm>
        <a-button
          v-if="hasPermission('monitor:log:export')"
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
              v-if="hasPermission('monitor:job:query')"
              type="link"
              class="text-btn"
              @click="handleDetailShow(record)"
            >
              <Icon icon="ant-design:eye-filled" />详情
            </a-button>
          </div>
        </template>
      </BasicTable>
    </card>
    <LogDetail @register="register1" />
  </PageWrapper>
</template>

<script lang="ts">
  import { usePermission } from '/@/hooks/web/usePermission';
  import { defineComponent, reactive, toRefs } from 'vue';
  import { Form, Input, Card, Popconfirm, message, Select, SelectOption } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { BasicData } from '/@/api/model/baseModel';
  import { getLogList, delLog, exportLog, clean } from '/@/api/monitor/jobLog';
  import { JobLogModel } from '/@/api/monitor/model/jobLogModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download } from '/@/utils';
  import { useModal } from '/@/components/Modal';
  import LogDetail from './components/LogDetail.vue';

  type DataModel = BasicData;

  export default defineComponent({
    name: 'Log',
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
      LogDetail,
    },
    setup() {
      const { hasPermission } = usePermission();
      const myData = reactive<DataModel>({
        queryParams: {},
        loading: false,
      });

      const columns: BasicColumn[] = [
        { title: '任务名称', dataIndex: 'jobName', width: 110 },
        { title: '任务组名', dataIndex: 'jobGroup', width: 110 },
        { title: '调用目标字符串', dataIndex: 'invokeTarget', width: 110 },
        { title: '日志信息', dataIndex: 'jobMessage', width: 110 },
        {
          title: '执行状态',
          dataIndex: 'status',
          format: (text: string) => {
            return text == '0' ? '成功' : '失败';
          },
          width: 110,
        },
        { title: '执行时间', dataIndex: 'createTime', width: 200 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'jobLogId',
        bordered: true,
        api: getLogList,
        showTableSetting: true,
        clickToRowSelect: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
      });

      const handleExport = () => {
        setLoading(true);
        exportLog(myData.queryParams)
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
      const handleDelete = (row: JobLogModel) => {
        setLoading(true);
        const ids = row.jobLogId || getSelectRowKeys();
        delLog(ids)
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

      const [register1, { openModal: openModal1 }] = useModal();
      const handleDetailShow = (row: JobLogModel) => {
        openModal1(true, row);
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
        handleDetailShow,
        register1,
        handleClean,
      };
    },
  });
</script>
