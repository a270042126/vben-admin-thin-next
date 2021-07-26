<template>
  <PageWrapper contentClass="flex">
    <!-- <template #headerContent> </template> -->
    <card style="margin-right: 20px">
      <InputSearch
        v-model:value="searchDepart"
        placeholder="请搜索部门"
        style="margin-bottom: 8px"
      />
      <Tree
        :expandedKeys="expandedKeys"
        :tree-data="departTree"
        :replaceFields="{ children: 'children', title: 'label', key: 'id' }"
        @expand="onExpand"
      />
    </card>
    <card>
      <Form
        :model="formData"
        ref="formRef"
        layout="horizontal"
        :label-col="{ span: 10 }"
        class="flex"
      >
        <FormItem label="用户名" name="username">
          <Input v-model:value="formData.username" placeholder="用户名" />
        </FormItem>
        <FormItem label="用户名" name="phoneNumber">
          <Input v-model:value="formData.phoneNumber" placeholder="用户名" />
        </FormItem>
      </Form>
    </card>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, watch, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Form, Input, Card, InputSearch, Tree } from 'ant-design-vue';
  import { getDepartTree } from '/@/api/sys/dept';
  import { departModel } from '/@/api/sys/model/departModel';

  interface DataModel {
    expandedKeys: Number[];
    departTree: departModel[];
    searchDepart: string;
    formData: Object;
    autoExpandParent: boolean;
  }

  export default defineComponent({
    components: {
      PageWrapper,
      Form,
      FormItem: Form.Item,
      Input,
      Card,
      InputSearch,
      Tree,
    },
    setup() {
      const data = reactive<DataModel>({
        expandedKeys: [],
        departTree: [],
        searchDepart: '',
        formData: {},
        autoExpandParent: false,
      });

      const searchDepart = computed<string>(() => {
        return data.searchDepart;
      });
      let backupsExpandedKeys: Number[] = [];
      // 获取节点中含有value的所有key集合
      const getkeyList = (value: string, tree: departModel[], keyList: Number[]) => {
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
      const getParentKey = (key: Number, tree: departModel[]) => {
        let parentKey: Number | null = null;
        let temp: Number | null = null;
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
      const getAllParentKey = (key: Number, tree: departModel[]) => {
        var parentKey;
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
        data.expandedKeys = [];
        if (val) {
          backupsExpandedKeys = [];
          //获取所有存在searchValue的节点
          let candidateKeysList = getkeyList(val, data.departTree, []);
          //遍历满足条件的所有节点
          candidateKeysList.map((item) => {
            //获取每个节点的母亲节点
            var key = getParentKey(item, data.departTree);
            //当item是最高一级，父key为undefined，将不放入到数组中
            //如果母亲已存在于数组中，也不放入到数组中
            if (key && !backupsExpandedKeys.some((item) => item === key))
              backupsExpandedKeys.push(key);
          });
          let length = backupsExpandedKeys.length;
          for (let i = 0; i < length; i++) {
            getAllParentKey(backupsExpandedKeys[i], data.departTree);
          }
          data.expandedKeys = backupsExpandedKeys.slice();
        }
      });
      const onExpand = (expandedKeys: Number[]) => {
        //用户点击展开时，取消自动展开效果
        data.expandedKeys = expandedKeys;
        data.autoExpandParent = false;
      };
      getDepartTree().then((res) => {
        data.departTree = res;
      });
      return {
        ...toRefs(data),
        onExpand,
      };
    },
  });
</script>
