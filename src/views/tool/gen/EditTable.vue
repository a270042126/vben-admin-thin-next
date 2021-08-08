<template>
  <PageWrapper>
    <card class="!mr-4 dep-tree">
      <Tabs defaultActiveKey="1">
        <TabPane tab="基本信息" key="1">
          <TableForm ref="baseRef" />
        </TabPane>
        <TabPane tab="字段信息" key="2" :forceRender="true">
          <FieldForm ref="fieldRef" />
        </TabPane>
        <TabPane tab="生成信息" key="3" :forceRender="true">
          <GenInfoForm ref="genInfoRef" />
        </TabPane>
      </Tabs>
      <div class="text-center">
        <a-button type="primary" class="mr-4" @click="onSubmit">保存</a-button>
        <a-button @click="goBack">返回</a-button>
      </div>
    </card>
    <Loading :loading="loading" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { Card, Tabs, message } from 'ant-design-vue';
  import TableForm from './components/TableForm.vue';
  import FieldForm from './components/FieldForm.vue';
  import GenInfoForm from './components/GenInfoForm.vue';
  import { PageWrapper } from '/@/components/Page';
  import { getGenTableByTableId, updateGenTable } from '/@/api/tool/gen';
  import { getRouteMenuList } from '/@/api/sys/menu';
  import { handleTree, getFathersById } from '/@/utils';
  import { Loading } from '/@/components/Loading';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { PageEnum } from '/@/enums/pageEnum';
  import bus from '/@/bus';

  export default defineComponent({
    // eslint-disable-next-line vue/component-definition-name-casing
    name: 'gen/edit/:tableId(\d+)',
    components: {
      PageWrapper,
      Card,
      TableForm,
      FieldForm,
      GenInfoForm,
      Tabs,
      TabPane: Tabs.TabPane,
      Loading,
    },
    setup() {
      const loading = ref<boolean>();
      const baseRef = ref();
      const fieldRef = ref();
      const genInfoRef = ref();
      const route = useRoute();
      const tableId = computed<string>(() => {
        return route.params.tableId as string;
      });
      const getTableInfo = () => {
        loading.value = true;
        const promise1 = getGenTableByTableId(tableId.value);
        const promise2 = getRouteMenuList();
        Promise.all([promise1, promise2])
          .then((values) => {
            const res1 = values[0];
            const info = res1.info;
            baseRef.value.form = info;
            fieldRef.value.setTableData(res1.rows);

            const res2 = values[1];
            const menuOptions = handleTree(res2, 'menuId');
            info.parentMenuIds = getFathersById(info.parentMenuId, menuOptions);
            genInfoRef.value.form = info;
            genInfoRef.value.menuOptions = menuOptions;
            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      };
      onMounted(() => {
        getTableInfo();
      });

      const go = useGo();
      const { closeCurrent } = useTabs();

      const goBack = () => {
        closeCurrent();
        go(PageEnum.GEN_TABLE, true);
      };

      const onSubmit = () => {
        loading.value = true;
        const promise1 = baseRef.value.$refs.formRef.validateFields();
        const promise2 = genInfoRef.value.$refs.formRef.validateFields();
        Promise.all([promise1, promise2]).then(() => {
          const genTable = Object.assign({}, baseRef.value.form, genInfoRef.value.form);
          genTable.columns = fieldRef.value.getDataSource();
          genTable.params = {
            treeCode: genTable.treeCode,
            treeName: genTable.treeName,
            treeParentCode: genTable.treeParentCode,
            parentMenuId: genTable.parentMenuId,
          };
          updateGenTable(genTable)
            .then(() => {
              message.success('修改成功');
              loading.value = false;
              bus.emit('genTableRefresh');
              goBack();
            })
            .catch(() => {
              loading.value = false;
            });
        });
      };

      return {
        goBack,
        loading,
        onSubmit,
        baseRef,
        fieldRef,
        genInfoRef,
      };
    },
  });
</script>
