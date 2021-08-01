<template>
  <PageWrapper contentClass="flex items-start">
    <!-- <template #headerContent> </template> -->
    <card class="!mr-4 dep-tree">
      <InputSearch v-model:value="searchDepart" placeholder="请搜索部门" />
      <Tree
        class="!mt-4"
        :expandedKeys="expandedKeys"
        :tree-data="departTree"
        :replaceFields="{ children: 'children', title: 'label', key: 'id' }"
        :onSelect="onSelectTree"
        @expand="onExpand"
      >
        <template #title="{ label }">
          <span v-if="label && label.indexOf(searchDepart) > -1">
            {{ label.substr(0, label.indexOf(searchDepart)) }}
            <span style="color: #f50">{{ searchDepart }}</span>
            {{ label.substr(label.indexOf(searchDepart) + searchDepart.length) }}
          </span>
          <span v-else>{{ label }}</span>
        </template>
      </Tree>
    </card>
    <card class="main">
      <Form
        :model="queryParams"
        ref="formRef"
        layout="horizontal"
        :label-col="{ span: 10 }"
        class="flex flex-wrap"
      >
        <FormItem label="用户名" name="username">
          <Input v-model:value="queryParams.userName" placeholder="用户名" />
        </FormItem>
        <FormItem label="手机号码" name="phoneNumber">
          <Input v-model:value="queryParams.phonenumber" placeholder="手机号码" />
        </FormItem>
        <a-button type="primary" class="ml-4" @click="search">搜索</a-button>
      </Form>
      <div class="flex mb-4 mt-2">
        <a-button type="primary" class="mr-4" @click="handleEdit()">
          <Icon icon="ant-design:file-add-outlined" />添加用户</a-button
        >
        <Popconfirm title="您确定删除吗" :onConfirm="handleDelete">
          <a-button type="primary" danger>删除</a-button>
        </Popconfirm>
      </div>
      <BasicTable
        :dataSource="dataList"
        :columns="columns"
        :pagination="{
          pageSize: queryParams.pageSize,
          total: total,
          onChange: handlePageNumChange,
          onShowSizeChange: handlePageSizeChange,
        }"
        :bordered="true"
        :scroll="{
          y: 495,
        }"
        rowKey="userId"
        :rowSelection="{ type: 'checkbox', selectedRowKeys, onChange: onSelected }"
        :loading="loading"
        style="width: 100%"
      >
        <template #action="{ record }">
          <div>
            <a-button type="link" class="text-btn" @click="handleEdit(record)"
              ><Icon icon="ant-design:edit-filled" />编辑</a-button
            >
            <a-button type="link" class="text-btn" @click="resetPassword(record)"
              ><Icon icon="ant-design:safety-outlined" />重置密码</a-button
            >
            <Popconfirm title="您确定删除吗" :onConfirm="handleDelete">
              <a-button type="link" danger class="text-btn" @click="handleDelete(record)"
                ><Icon icon="ic:outline-delete-outline" />删除</a-button
              >
            </Popconfirm>
          </div>
        </template>
      </BasicTable>
    </card>
    <AuData @register="register1" @onRefresh="getList" />
    <ResetPwd @register="register2" @onRefresh="getList" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, watch, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { Form, Input, Card, InputSearch, Tree, Popconfirm } from 'ant-design-vue';
  import { DepartTreeModel } from '/@/api/sys/model/departModel';
  import { useDepartStore } from '/@/store/modules/system/depart';
  import { getUserList, deleteUser } from '/@/api/sys/user';
  import { UserModel } from '/@/api/sys/model/userModel';
  import { BasicData, BasicParams } from '/@/api/model/baseModel';
  import { useList } from '/@/hooks/component/useList';
  import AuData from './components/AuData.vue';
  import ResetPwd from './components/ResetPwd.vue';
  import { useModal } from '/@/components/Modal';
  import { BasicColumn } from '/@/components/Table/index';
  import { useMessage } from '/@/hooks/web/useMessage';

  interface ParamsModel extends BasicParams, UserModel {}

  interface DataModel extends BasicData<UserModel> {
    expandedKeys: number[];
    searchDepart: string;
    autoExpandParent: boolean;
    queryParams: ParamsModel;
    selectedRowKeys: number[];
  }

  const columns: BasicColumn[] = [
    { title: '用户名', dataIndex: 'userName', width: 110 },
    { title: '用户昵称', dataIndex: 'nickName', width: 110 },
    { title: '部门', dataIndex: 'dept.deptName', width: 110 },
    { title: '手机号', dataIndex: 'phonenumber', width: 130 },
    { title: '创建时间', dataIndex: 'createTime', width: 200 },
    { title: '操作', slots: { customRender: 'action' }, width: 250 },
  ];

  export default defineComponent({
    components: {
      PageWrapper,
      Form,
      FormItem: Form.Item,
      Input,
      Card,
      InputSearch,
      Tree,
      BasicTable,
      Icon,
      AuData,
      Popconfirm,
      ResetPwd,
    },
    setup() {
      const myData = reactive<DataModel>({
        expandedKeys: [],
        searchDepart: '',
        queryParams: {},
        autoExpandParent: false,
        dataList: [],
        total: 0,
        selectedRowKeys: [],
      });

      const departStore = useDepartStore();
      departStore.setDepartTree();
      const departTree = computed<DepartTreeModel[]>(() => {
        return departStore.getDepartTree;
      });

      //  部门
      const searchDepart = computed<string>(() => {
        return myData.searchDepart;
      });
      let backupsExpandedKeys: number[] = [];
      // 获取节点中含有value的所有key集合
      const getkeyList = (value: string, tree: DepartTreeModel[], keyList: number[]) => {
        //遍历所有同一级的树
        for (let i = 0; i < tree.length; i++) {
          let node = tree[i];
          //如果该节点存在value值则push
          if (node.label.indexOf(value) > -1) {
            keyList.push(node.id);
          }
          //如果拥有孩子继续遍历
          if (node.children) {
            getkeyList(value, node.children, keyList);
          }
        }
        //因为是引用类型，所有每次递归操作的都是同一个数组
        return keyList;
      };

      //该递归主要用于获取key的父亲节点的key值
      const getParentKey = (key: number, tree: DepartTreeModel[]) => {
        let parentKey: number | null = null;
        let temp: number | null = null;
        //遍历同级节点
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            //如果该节点的孩子中存在该key值，则该节点就是我们要找的父亲节点
            //如果不存在，继续遍历其子节点
            if (node.children.some((item) => item.id === key)) {
              parentKey = node.id;
            } else if ((temp = getParentKey(key, node.children))) {
              //parentKey = this.getParentKey(key,node.children)
              //改进，避免二次遍历
              parentKey = temp;
            }
          }
        }
        return parentKey;
      };

      //获取该节点的所有祖先节点
      const getAllParentKey = (key: number, tree: DepartTreeModel[]) => {
        let parentKey: number;
        if (key) {
          //获得父亲节点
          parentKey = getParentKey(key, tree);
          if (parentKey) {
            //如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
            if (!backupsExpandedKeys.some((item) => item === parentKey)) {
              backupsExpandedKeys.push(parentKey);
            }
            //继续向上查找祖先节点
            getAllParentKey(parentKey, tree);
          }
        }
      };

      watch(searchDepart, (val) => {
        myData.expandedKeys = [];
        if (val) {
          backupsExpandedKeys = [];
          //获取所有存在searchValue的节点
          let candidateKeysList = getkeyList(val, departTree.value, []);
          //遍历满足条件的所有节点
          candidateKeysList.map((item) => {
            //获取每个节点的母亲节点
            var key = getParentKey(item, departTree.value);
            //当item是最高一级，父key为undefined，将不放入到数组中
            //如果母亲已存在于数组中，也不放入到数组中
            if (key && !backupsExpandedKeys.some((item) => item === key))
              backupsExpandedKeys.push(key);
          });
          let length = backupsExpandedKeys.length;
          for (let i = 0; i < length; i++) {
            getAllParentKey(backupsExpandedKeys[i], departTree.value);
          }
          myData.expandedKeys = backupsExpandedKeys.slice();
        }
      });
      const onExpand = (expandedKeys: number[]) => {
        //用户点击展开时，取消自动展开效果
        myData.expandedKeys = expandedKeys;
        myData.autoExpandParent = false;
      };

      // 用户
      const getList = () => {
        myData.loading = true;
        getUserList(myData.queryParams)
          .then((res) => {
            myData.dataList = res.rows;
            myData.total = res.total;
            myData.loading = false;
          })
          .catch(() => {
            myData.loading = false;
          });
      };

      const { search, handlePageNumChange, handlePageSizeChange } = useList(
        getList,
        myData.queryParams
      );
      search();

      const onSelectTree = (keys: number[]) => {
        myData.queryParams.deptId = keys[0];
        search();
      };

      const [register1, { openModal: openModal1, setModalProps: setModalProps1 }] = useModal();

      const handleEdit = (row: UserModel) => {
        if (row) {
          setModalProps1({ title: '修改用户' });
        } else {
          row = {};
          setModalProps1({ title: '添加用户' });
        }
        openModal1(true, row);
      };

      const { notification } = useMessage();
      const handleDelete = (row: UserModel) => {
        const userIds = row.userId || myData.selectedRowKeys;
        myData.loading = true;
        deleteUser(userIds)
          .then(() => {
            notification.success({
              message: '删除成功',
              duration: 3,
            });
            myData.selectedRowKeys = [];
            getList();
          })
          .catch(() => {
            myData.loading = false;
          });
      };

      const onSelected = (keys: number[]) => {
        myData.selectedRowKeys = keys;
      };

      const [register2, { openModal: openModal2 }] = useModal();
      const resetPassword = (row: UserModel) => {
        openModal2(true, row);
      };

      return {
        resetPassword,
        onSelected,
        onSelectTree,
        departTree,
        columns,
        ...toRefs(myData),
        onExpand,
        getList,
        search,
        handlePageNumChange,
        handlePageSizeChange,
        handleEdit,
        handleDelete,
        register1,
        register2,
      };
    },
  });
</script>

<style lang="less" scoped>
  .dep-tree {
    min-height: 400px;
    min-width: 300px;
  }

  .main {
    flex: auto;
    min-width: 0;
    padding: 40px 0;
  }
</style>
