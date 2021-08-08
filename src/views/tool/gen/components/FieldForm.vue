<template>
  <BasicTable @register="registerTable" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getDictTypeOptions } from '/@/api/sys/dict';

  const columns: BasicColumn[] = [
    { title: '字段列名', dataIndex: 'columnName', width: 110 },
    {
      title: '字段描述',
      dataIndex: 'columnComment',
      edit: true,
      editComponent: 'Input',
      width: 200,
    },
    { title: '数据类型', dataIndex: 'columnType', width: 200 },
    {
      title: 'Java类型',
      dataIndex: 'javaType',
      edit: true,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: 'Long',
            value: 'Long',
          },
          {
            label: 'String',
            value: 'String',
          },
          {
            label: 'Integer',
            value: 'Integer',
          },
          {
            label: 'Double',
            value: 'Double',
          },
          {
            label: 'BigDecimal',
            value: 'BigDecimal',
          },
          {
            label: 'Date',
            value: 'Date',
          },
        ],
      },
      width: 200,
    },
    {
      title: 'Java属性',
      dataIndex: 'javaField',
      edit: true,
      editComponent: 'Input',
      width: 200,
    },
    {
      title: '插入',
      dataIndex: 'isInsert',
      edit: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value == '1' ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '编辑',
      dataIndex: 'isEdit',
      edit: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value == '1' ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '列表',
      dataIndex: 'isList',
      edit: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value == '1' ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '查询',
      dataIndex: 'isQuery',
      edit: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value == '1' ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '查询方式',
      dataIndex: 'queryType',
      edit: true,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: '=',
            value: 'EQ',
          },
          {
            label: '!=',
            value: 'NE',
          },
          {
            label: '>',
            value: 'GT',
          },
          {
            label: '>=',
            value: 'GTE',
          },
          {
            label: '<',
            value: 'LT',
          },
          {
            label: '<=',
            value: 'LTE',
          },
          {
            label: 'LIKE',
            value: 'LIKE',
          },
          {
            label: 'BETWEEN',
            value: 'BETWEEN',
          },
        ],
      },
      width: 200,
    },
    {
      title: '必填',
      dataIndex: 'isRequired',
      edit: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value == '1' ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '显示类型',
      dataIndex: 'htmlType',
      edit: true,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: '文本框',
            value: 'input',
          },
          {
            label: '文本域',
            value: 'texterea',
          },
          {
            label: '下拉框',
            value: 'select',
          },
          {
            label: '单选框',
            value: 'radio',
          },
          {
            label: '复选框',
            value: 'checkbox',
          },
          {
            label: '日期控件',
            value: 'datetime',
          },
          {
            label: '图片上传',
            value: 'imageUpload',
          },
          {
            label: '文件上传',
            value: 'fileUpload',
          },
          {
            label: '富文本控件',
            value: 'editor',
          },
        ],
      },
      width: 200,
    },
  ];

  export default defineComponent({
    components: {
      BasicTable,
    },
    setup() {
      const [registerTable, { setTableData, setColumns, getDataSource }] = useTable({
        columns: columns,
        rowKey: 'columnId',
        bordered: true,
        pagination: false,
      });

      getDictTypeOptions().then((res) => {
        const options: Recordable[] = [];
        res.map((item) => {
          options.push({
            label: item.dictName + ' ' + item.dictType,
            value: item.dictType,
          });
        });
        const column: BasicColumn = {
          title: '字典类型',
          dataIndex: 'dictType',
          width: 250,
          edit: true,
          editComponent: 'Select',
          editComponentProps: {
            options: options,
          },
        };
        columns.push(column);
        setColumns(columns);
      });

      return {
        getDataSource,
        setTableData,
        registerTable,
      };
    },
  });
</script>
