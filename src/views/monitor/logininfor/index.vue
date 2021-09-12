<template>
  <PageWrapper v-loading="loading" contentClass="flex items-start">
    <card class="my-card">
      <Form :model="queryParams" ref="formRef" layout="horizontal" class="m-form">
        <FormItem label="用户账号" name="userName">
          <Input
            v-model:value="queryParams.userName"
            allowClear
            placeholder="请输入用户账号"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="登录IP地址" name="ipaddr">
          <Input
            v-model:value="queryParams.ipaddr"
            allowClear
            placeholder="请输入登录IP地址"
            :onPressEnter="handleReload"
          />
        </FormItem>
        <FormItem label="登录状态" name="status">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择登录状态"
            :allowClear="true"
            :onPressEnter="handleReload"
          >
            <SelectOption value="0">成功</SelectOption>
            <SelectOption value="1">失败</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="访问时间" name="loginTime">
          <RangePicker v-model:value="daterangeLoginTime" />
        </FormItem>
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <div class="flex my-4">
        <Popconfirm
          v-if="hasPermission('monitor:logininfor:remove')"
          title="您确定删除吗"
          @confirm="handleDelete"
        >
          <a-button type="primary" danger><Icon icon="ic:outline-delete-outline" />删除</a-button>
        </Popconfirm>
        <Popconfirm
          v-if="hasPermission('monitor:logininfor:remove')"
          title="您确定清空吗"
          @confirm="handleClean"
        >
          <a-button class="ml-4" type="primary" danger
            ><Icon icon="ic:outline-delete-outline" />清空</a-button
          >
        </Popconfirm>
        <a-button
          v-if="hasPermission('monitor:logininfor:export')"
          type="primary"
          class="ml-4"
          @click="handleExport()"
        >
          <Icon icon="ant-design:vertical-align-bottom-outlined" />导出</a-button
        >
      </div>
      <BasicTable @register="registerTable" />
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
  import {
    getLogininforList,
    delLogininfor,
    exportLogininfor,
    clean,
  } from '/@/api/monitor/logininfor';
  import { LogininforModel } from '/@/api/monitor/model/logininforModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { download } from '/@/utils';
  import { formatToDate } from '/@/utils/dateUtil';

  interface DataModel extends BasicData {
    // 访问时间时间范围
    daterangeLoginTime: Date[];
  }

  export default defineComponent({
    name: 'Logininfor',
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
        // 访问时间时间范围
        daterangeLoginTime: [],
      });

      const columns: BasicColumn[] = [
        { title: '用户账号', dataIndex: 'userName', width: 150 },
        { title: '登录IP地址', dataIndex: 'ipaddr', width: 150 },
        { title: '登录地点', dataIndex: 'loginLocation', width: 110 },
        { title: '操作系统', dataIndex: 'os', width: 110 },
        { title: '浏览器类型', dataIndex: 'browser', width: 110 },
        {
          title: '登录状态',
          dataIndex: 'status',
          width: 110,
          format: (text: string) => {
            return text == '0' ? '成功' : '失败';
          },
        },
        { title: '提示消息', dataIndex: 'msg', width: 110 },
        { title: '登录时间', dataIndex: 'loginTime', width: 180 },
      ];

      const [registerTable, { reload, getSelectRowKeys, setLoading }] = useTable({
        columns: columns,
        rowKey: 'infoId',
        bordered: true,
        api: getLogininforList,
        showTableSetting: true,
        clickToRowSelect: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          myData.queryParams.params = {};
          if (myData.daterangeLoginTime && myData.daterangeLoginTime.length > 0) {
            myData.queryParams.params['beginLoginTime'] = formatToDate(
              myData.daterangeLoginTime[0]
            );
            myData.queryParams.params['endLoginTime'] = formatToDate(myData.daterangeLoginTime[1]);
          }
          return myData.queryParams;
        },
      });

      const handleExport = () => {
        setLoading(true);
        exportLogininfor(myData.queryParams)
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
      const handleDelete = (row: LogininforModel) => {
        setLoading(true);
        const ids = row.infoId || getSelectRowKeys();
        delLogininfor(ids)
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
        handleClean,
      };
    },
  });
</script>
