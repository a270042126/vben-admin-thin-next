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
        <a-button type="primary" class="ml-4" @click="handleReload">搜索</a-button>
        <a-button class="ml-4" @click="resetQuery">重置</a-button>
      </Form>
      <BasicTable @register="registerTable">
        <template #action="{ record }">
          <div>
            <Popconfirm
              v-if="hasPermission('monitor:online:forceLogout')"
              title="您确定强退吗"
              @confirm="handleForceLogout(record)"
            >
              <a-button type="link" danger class="text-btn"
                ><Icon icon="ic:outline-delete-outline" />强退</a-button
              >
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
  import { Form, Input, Card, Popconfirm, message } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { BasicData } from '/@/api/model/baseModel';
  import { useSelect } from '/@/hooks/component/useSelect';
  import { getOnlineList, forceLogout } from '/@/api/monitor/online';
  import { OnlineModel } from '/@/api/monitor/model/onlineModel';

  type DataModel = BasicData;

  export default defineComponent({
    name: 'Online',
    components: {
      PageWrapper,
      Form,
      FormItem: Form.Item,
      Input,
      Card,
      BasicTable,
      Icon,
      Popconfirm,
    },
    setup() {
      const { hasPermission } = usePermission();
      const myData = reactive<DataModel>({
        queryParams: {},
        loading: false,
      });

      const columns: BasicColumn[] = [
        { title: '用户账号', dataIndex: 'userName', width: 150 },
        { title: '部门名称', dataIndex: 'deptName', width: 150 },
        { title: '登录IP地址', dataIndex: 'ipaddr', width: 150 },
        { title: '登录地点', dataIndex: 'loginLocation', width: 110 },
        { title: '浏览器类型', dataIndex: 'browser', width: 110 },
        { title: '操作系统', dataIndex: 'os', width: 110 },
        { title: '登录时间', dataIndex: 'loginTime', width: 180 },
        { title: '操作', dataIndex: 'action', slots: { customRender: 'action' }, width: 110 },
      ];

      const [registerTable, { reload, setLoading }] = useTable({
        columns: columns,
        rowKey: 'tokenId',
        bordered: true,
        api: getOnlineList,
        showTableSetting: true,
        clickToRowSelect: false,
        rowSelection: { type: 'checkbox' },
        beforeFetch: () => {
          myData.queryParams.params = {};
          return myData.queryParams;
        },
      });

      const handleReload = () => {
        reload({ page: 1 });
      };
      const handleForceLogout = (row: OnlineModel) => {
        setLoading(true);
        const id = row.tokenId!;
        forceLogout(id)
          .then(() => {
            message.success('强退成功');
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
        handleForceLogout,
        handleReload,
        registerTable,
        ...toRefs(myData),
        resetQuery,
        filterOption,
      };
    },
  });
</script>
