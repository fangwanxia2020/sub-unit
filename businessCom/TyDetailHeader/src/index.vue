 <!-- 新增ty-detail-header 智慧园区 详情页 header 业务组件 -- 2022.09.09- by ylq -->
<template>
  <div>
    <div class="detail_header">
      <el-button type="text" icon="el-icon-arrow-left" @click="goBack">{{
        goBackText
      }}</el-button>
      <span class="header_title">{{ titleType }}-{{ headerName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TyDetailHeader',
  data() {
    return {}
  },
  props: {
    //页面类型  add  edit check
    pageType: {
      type: String,
      default: '',
    },
    //标题
    headerName: {
      type: String,
      default: '标题',
    },
    //返回按钮文案
    goBackText: {
      type: String,
      default: '返回',
    },
    //  返回按钮事件 是否自定义回调处理
    customGoBack: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    titleType() {
      let pageType = ''
      pageType =
        this.pageType == 'add'
          ? '新增'
          : this.pageType == 'edit'
          ? '修改'
          : '查看'
      return pageType
    },
  },
  methods: {
    goBack() {
      if (this.customGoBack) {
        this.$emit('goBackFun')
      } else {
        this.$router.go(-1)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.detail_header {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 12px;
  .header_title {
    font-size: 18px;
    font-weight: bold;
    margin-left: 24px;
  }
}
</style>
