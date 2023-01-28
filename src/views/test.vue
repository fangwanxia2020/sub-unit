<template>
  <div>
     <el-button @click="visible = true">open</el-button>
    <ty-dialog-super
      :visible.sync="visible"
      :title="title"
      @close="closeDialog"
      :minimize="true"
      width="600px"
    >
      <div>aaa</div>
    </ty-dialog-super>
    <el-button @click="visible1 = true">open1</el-button>
    <ty-dialog-super
      :visible.sync="visible1"
      title="abc"
      @close="closeDialog1"
      :minimize="true"
      width="600px"
    >
      <div>bbb</div>
    </ty-dialog-super>
     <ty-dialog-tags :offsetLeft="400" />
  <!--  <ty-watermark title="hahahha" >
             <div style="display: flex; align-items: center; justify-content: center; height: 80px; line-height: 80px; padding: 80px; color: #000; font-size: 18px; box-sizing: content-box;">
                <span>天源综合实践学习系统</span>
            </div>
    </ty-watermark> -->
    <!-- :datesRange='["2022-05","2023-02"]'  -->
    <!-- <TyCustomCalendar :dataList='dataList'  >
     <template slot="tooltipContent" slot-scope="slotProps">
            {{slotProps.data.date}}
      </template>
    </TyCustomCalendar> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      visible1: false,
      title: 'test',
      dataList:[
         {date:"2022-12-01",info:{a:"cbd"}},
         {date:"2022-12-04",info:"哈哈哈"},
         {date:"2023-01-04",info:"哈哈哈"}
      ]
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('update:visible', false)
    },
    closeDialog1() {
      this.$emit('update:visible1', false)
    },
  },
}
</script>


