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
        <FormItem label="状态" name="status">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            :allowClear="true"
            :onPressEnter="handleReload"
          >
            <SelectOption value="0">正常</SelectOption>
            <SelectOption value="1">暂停</SelectOption>
          </Select>
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <div class="flex my-4">
        <a-button
          v-if="hasPermission('monitor:job:add')"
          type="primary"
          class="mr-4"
          @click="handleEdit()"
        >
          <Icon icon="ant-design:file-add-outlined" />添加</a-button
        >
        <Popconfirm
          v-if="hasPermission('monitor:job:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
      </div>
      <BasicTable @register="registerTable">
        <template #action="{ record }">
          <div>
            <a-button
              v-if="hasPermission('monitor:job:query')"
              type="link"
              class="text-btn"
              @click="handleLogShow(record)"
            >
              <Icon icon="ant-design:edit-filled" />调度日志
            </a-button>
            <a-button
              v-if="hasPermission('monitor:job:edit')"
              type="link"
              class="text-btn"
              @click="handleEdit(record)"
            >
              <Icon icon="ant-design:edit-filled" />编辑
            </a-button>
            <Popconfirm
              v-if="hasPermission('monitor:job:remove')"
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
  import { getJobList, delJob } from '/@/api/monitor/job';
  import { JobModel } from '/@/api/monitor/model/jobModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';

  type DataModel = BasicData;

  export default defineComponent({
    name: 'Job',
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
        { title: '任务名称', dataIndex: 'jobName', width: 150 },
        { title: '任务组名', dataIndex: 'jobGroup', width: 110 },
        { title: '调用目标字符串', dataIndex: 'invokeTarget', width: 150 },
        { title: 'cron执行表达式', dataIndex: 'cronExpression', width: 200 },
        {
          title: '状态',
          dataIndex: 'status',
          format: (text: string) => {
            return text == '0' ? '正常' : '暂停';
          },
          width: 110,
        },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 250 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'jobId',
        bordered: true,
        api: getJobList,
        showTableSetting: true,
        clickToRowSelect: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          return myData.queryParams;
        },
      });

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: JobModel) => {
        if (row) {
          setModalProps1({ title: '修改定时任务调度' });
        } else {
          row = {};
          setModalProps1({ title: '添加定时任务调度' });
        }
        openModal1(true, row);
      };
      const handleReload = () => {
        reload({ page: 1 });
      };
      const handleDelete = (row: JobModel) => {
        setLoading(true);
        const ids = row.jobId || getSelectRowKeys();
        delJob(ids)
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

      const go = useGo();
      const handleLogShow = (row: JobModel) => {
        go(`${PageEnum.JOB_LOG_TABLE}${row.jobId}`);
      };

      const { filterOption } = useSelect();
      return {
        hasPermission,
        reload,
        handleEdit,
        handleDelete,
        handleReload,
        registerTable,
        ...toRefs(myData),
        resetQuery,
        filterOption,
        register1,
        handleLogShow,
      };
    },
  });
</script>
