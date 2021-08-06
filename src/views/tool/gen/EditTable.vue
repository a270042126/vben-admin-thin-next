<template>
  <PageWrapper>
    <card class="!mr-4 dep-tree">
      <Tabs defaultActiveKey="1">
        <TabPane tab="基本信息" key="1">
          <TableInfo />
        </TabPane>
      </Tabs>
    </card>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Card, Tabs } from 'ant-design-vue';
  import TableInfo from './components/TaleInfo.vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: {
      PageWrapper,
      Card,
      TableInfo,
      Tabs,
      TabPane: Tabs.TabPane,
    },
    setup() {
      //
    },
  });
</script>
