<template>
  <div>
    <ty-business-form-manage
      ref="aa"
      v-if="showCom"
      buttonType="default"
      buttonSize="large"
      size="mini"
      :pageFormat="{
        pageNum: 'pageNum',
        pageSize: 'pageSize',
      }"
      :pageInfo="{
        pageNo: 1,
        limit: 10,
        sizes: [5, 10],
        total: 0,
      }"
    >
      <template
        slot="rowOperator"
        slot-scope="{row}"
      >
        <el-button @click="fabuFun(row)">发布</el-button>
      </template>
    </ty-business-form-manage>
  </div>
</template>
<script>
import {
  setToken
}
from 'utils/auth';
export default {
  data() {
    return {
      showCom: false
    }
  },
  watch: {},
  created() {
    window.OUTVUE.prototype.request({
      url: 'http://192.168.1.147:9547/yanxue-association-server/login',
      method: "post",
      data: {
        orgId: "",
        password: "admin123",
        username: "admin"
      }
    }).then(res => {
      setToken(res.token);
      this.showCom = true;
    });
  },
  methods: {
    fabuFun(row) {
      console.log(row);
      this.$refs.aa.getList();
    }
  }
}

</script>
<style scoped>
</style>
