<template>
  <ty-table
    class="table"
    ref="tyTable"
    show-select
    hide-page
    :check-list="checkList"
    :columns="tableColumns"
    :data="tableData"
  />
</template>

<script>
export default {
  name: 'Table',
  data() {
    return {
      tableColumns: [
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '内容',
          prop: 'content'
        }
      ],
      tableData: [
        {
          title: '标题1',
          content: '内容1',
          id: '1',
          children: [
            {
              title: '标题1-1',
              content: '内容1-1',
              id: '1-1',
            },
            {
              title: '标题1-2',
              content: '内容1-2',
              id: '1-2',
              children: [
                {
                  title: '标题1-2-1',
                  content: '内容1-2-1',
                  id: '1-2-1',
                },
                {
                  title: '标题1-2-2',
                  content: '内容1-2-2',
                  id: '1-2-2',
                }
              ]
            }
          ]
        },
        {
          title: '标题2',
          content: '内容2',
          id: '2'
        }
      ]
    }
  },
  computed: {
    checkList() {
      return [this.tableData[0]]
    }
  }
}
</script>
