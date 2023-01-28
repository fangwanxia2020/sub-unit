<!--流程实例图-->
<template>
  <div class="flow-show-ctn-wrap">
    <div class="tag-group">
      <el-tag
        v-for="item in statusList"
        :key="item.label"
        :type="item.type"
        effect="dark"
        size='mini'
      >
        {{ item.label }}
      </el-tag>
    </div>
    <div class="start-flow">开始</div>
    <div class="flow-ctn-wrap">
      <div
        class="flow-ctn"
        v-for="(item,index) in data"
        :key="index"
      >
        <div :class="{
          title:true,
          expectPend:item.status==1,
          pending:item.status==2,
          resolve:item.status==3,
          reject:item.status==4,
          }">{{getTypeName(item.nodeType)}}</div>
        <div class="content">{{item.actionerUsers}}</div>
      </div>
    </div>
    <div class="end-flow">流程结束</div>
  </div>
</template>
<script>
// 流程步骤状态 1=待审批，2=审批中，3=审批通过，4=审批不通过
// import data from './test.json'
export default {
  name: 'FlowShow',
  components: {},
  props: {
    //当前的值
    data: {
      type: Array,
      default: () => {
        // console.log(data);
        return [];
        // return data
      }
    },
  },
  computed: {},
  data() {
    return {
      statusList: [{
        type: 'info',
        label: '待审批'
      }, {
        type: 'warning',
        label: '审批中'
      }, {
        type: 'success',
        label: '通过'
      }, {
        type: 'danger',
        label: '不通过'
      }]
    }
  },
  watch: {},
  methods: {
    getTypeName(type) {
      let name = ""
      switch (type) {
        case "approver":
          name = "审批人"
          break;
        case "start":
          name = "发起人"
          break;
        case "notifier":
          name = "抄送人"
          break;
      }
      return name;
    }
  }
}

</script>
<style
  lang="scss"
  scoped
>
.flow-show-ctn-wrap {
  padding: 10px;
  color: #666;
  font-size: 14px;

  .tag-group {
    width: 220px;
    display: flex;
    justify-content: space-around;
  }
  
  .start-flow {
    width: 220px;
    height: 20px;
    position: relative;
    text-align: center;
    padding: 10px 0 50px;

    &::after {
      content: "";
      border: 1px solid #ddd;
      height: 50px;
      position: absolute;
      bottom: -30px;
      left: 50%;
      margin-left: -2px;
    }
    
    &::before {
      content: "";
      border-radius: 50%;
      background: #999;
      width: 10px;
      height: 10px;
      position: absolute;
      top: 30px;
      left: 50%;
      margin: 0 0 0 -6px;
    }
  }
  
  .end-flow {
    width: 220px;
    height: 20px;
    position: relative;
    text-align: center;
    padding: 10px 0 20px;

    &::after {
      content: "";
      border-radius: 50%;
      background: #999;
      width: 10px;
      height: 10px;
      position: absolute;
      top: -2px;
      left: 50%;
      margin: 0 0 0 -6px;
    }
  }
  
  .flow-ctn {
    position: relative;
    width: 220px;
    min-height: 72px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #ddd;
    margin-bottom: 50px;

    .title {
      font-size: 12px;
      padding: 10px;
      color: #fff;
    }
    
    .expectPend {
      background: #d5d5d5;
    }
    
    .pending {
      background: #f90;
    }
    
    .resolve {
      background: #67C23A;
    }
    
    .reject {
      background: #ff4d4f;
    }
    
    .content {
      color: #666;
      padding: 10px;
    }
    
    &::after {
      content: "";
      border: 1px solid #ddd;
      height: 50px;
      position: absolute;
      bottom: -50px;
      left: 50%;
      margin-left: -2px;
    }
    
    &::before {
      content: "";
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-top: 10px solid #ddd;
      position: absolute;
      bottom: -51px;
      left: 50%;
      margin-left: -12px;
    }
  }
  
  .flow-ctn-wrap .flow-ctn:last-child {
    &::before {
      display: none;
    }
  }
}

</style>
