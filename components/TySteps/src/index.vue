<template>
  <div
    class="ty-steps"
    :style="{width:width}"
    ref="tyStepCom"
  >
    <div class="ty-steps__head">
      <div class="ty-steps__head__container">
        <ul class="ty-steps__head__container__steps">
          <li
            :class="{active:(active==item.id)}"
            v-for="(item,index) in data"
            :key="index"
            @click="changeStep(item.id)"
          >
            <a href="javascript:void(0)">{{item.title}}</a>
          </li>
        </ul>
      </div>
    </div>
    <el-tabs
      tab-position="left"
      v-model="active"
    >
      <el-tab-pane
        :label="item.title"
        :name="item.id"
        v-for="(item,index) in data"
        :key="index"
      >
        <div
          class="ty-steps__tabs__pane"
          :style="{height:autoHeight+'px'}"
        >
          <component
            :is="item.content"
            v-if="item.type=='component'"
          ></component>
          <div v-else-if="item.type=='slot'">
            <slot :name="item.content"></slot>
          </div>
          <div v-else>{{item.content}}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div
      class="ty-steps__btnwrap"
      v-if="(data&&data.length>0)"
    >
      <el-button
        plain
        :disabled="active==data[0].id"
        @click="lastStepFun"
      >上一步</el-button>
      <el-button
        plain
        :disabled="active==data[(data.length-1)].id"
        @click="nextStepFun"
      >下一步</el-button>
      <slot
        name="operation"
        v-if="active==data[(data.length-1)].id"
      ></slot>
    </div>
  </div>
</template>
<script>
/**
 * 组件名称 TySteps
 * @module components/others/TySteps
 * @desc 步骤条带tab功能
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {String} [active]    - 当前选中的步骤
 * @param {Function} [beforeChangeStep] - 切换step前触发事件
 * @param {String} [width] - 宽度
 * @param {String} [width] - 步骤的列表数据
 * @param {Array} [data] - 宽度
 * @example 调用示例
 *    <ty-steps
          :active.sync="stepActive"
          :data="tabStepArr"
          width="900px"
          :beforeChangeStep="beforeChangeStepFun"
      >
          <el-button plain slot="operation" type="primary">保存</el-button>
      </ty-steps>
 **/
export default {
  name: "TySteps",
  props: {
    //当前选中的步骤
    active: {
      type: String,
      default: "1",
      required: true
    },
    //切换step前触发事件(并且是下一步的时候)
    //注意beforeChangeStep需要return回一个异步方法
    beforeChangeStep: {
      type: Function
    },
    //宽度
    width: {
      //宽度
      type: String,
      default: "600px"
    },
    //步骤的列表数据
    data: {
      //列表数据
      //id:tab项id,用于与active对应
      //title：步骤条名称
      //content:tab内容
      //type:component组件类型或者string,默认为字符类型
      type: Array,
      default: () => []
    }
  },
  computed: {},
  watch: {
    active(val) {
      this.$emit("changeStep", val);
    }
  },
  data() {
    return {
      autoHeight: 400
    };
  },
  mounted() {
    this.$nextTick(function() {
      let self = this;
      this.autoHeight = self.$refs.tyStepCom.parentNode.clientHeight - 110;
      // 监听窗口大小变化
      window.onresize = function() {
        self.autoHeight = self.$refs.tyStepCom.parentNode.clientHeight - 110;
      };
    });
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
  methods: {
    nextStepFun() {
      let thisIndex = this.data.findIndex(item => item.id == this.active);
      if (thisIndex < this.data.length) {
        const nextId = this.data[thisIndex + 1].id;
        this.changeStep(nextId);
      }
    },
    lastStepFun() {
      let thisIndex = this.data.findIndex(item => item.id == this.active);
      if (thisIndex > 0) {
        const lastId = this.data[thisIndex - 1].id;
        this.changeStep(lastId);
      }
    },
    changeStep(val) {
      //当点击下一步的时候并且验证方法存在需要触发验证方法
      if (this.beforeChangeStep && val > this.active) {
        const fun = this.beforeChangeStep();
        if (fun) {
          //判断是否promise方法
          fun.then(result => {
            this.$emit("update:active", val);
          });
        }
        else {
          this.$emit("update:active", val);
        }
      }
      else {
        this.$emit("update:active", val);
      }
    }
  }
};

</script>
<style
  lang="less"
  scoped
>
.ty-steps__btnwrap {
  text-align: center;
  padding: 10px;
}

.ty-steps {
  .ty-steps__head__container__steps .active {
    background: #409eff;
  }
  
  .ty-steps__head__container__steps .active:after {
    border-left-color: #409eff;
  }
  
  /deep/ .el-tabs--left .el-tabs__header.is-left {
    display: none;
  }
  
  /deep/ .el-tabs__content {
    min-height: 100px;
  }
  
  .ty-steps__head__container__steps {
    font-size: 14px;
    margin: 0;
    padding: 0;
    background: #fff;
    display: flex;
  }
  
  .ty-steps__head__container__steps .active {
    color: #fff;
  }
  
  .ty-steps__head__container__steps .active a {
    color: #fff;
    cursor: pointer;
  }
  
  .ty-steps__head__container__steps .label {
    position: relative;
    top: -1px;
    margin: 0 5px 0 0;
    padding: 1px 5px 2px;
  }
  
  .ty-steps__head__container__steps .active .label {
    background-color: #333;
  }
  
  .ty-steps__head__container__steps li {
    cursor: pointer;
    flex: auto;
    position: relative;
    margin-right: 5px;
    padding: 12px 17px 10px 30px;
    *display: inline;
    *padding-left: 17px;
    background: #efefef;
    line-height: 18px;
    list-style: none;
    zoom: 1;
    text-align: center;
  }
  
  .ty-steps__head__container__steps li:first-child {
    padding-left: 12px;
    -moz-border-radius: 4px 0 0 4px;
    -webkit-border-radius: 4px 0 0 4px;
    border-radius: 4px 0 0 4px;
  }
  
  .ty-steps__head__container__steps li:first-child:before {
    border: none;
  }
  
  .ty-steps__head__container__steps li:last-child {
    margin-right: 0;
    -moz-border-radius: 0 4px 4px 0;
    -webkit-border-radius: 0 4px 4px 0;
    border-radius: 0 4px 4px 0;
  }
  
  .ty-steps__head__container__steps li:last-child:after {
    border: none;
  }
  
  .ty-steps__head__container__steps li:before {
    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    width: 0;
    border-bottom: 20px inset transparent;
    border-left: 20px solid #fff;
    border-top: 20px inset transparent;
    content: "";
  }
  
  .ty-steps__head__container__steps li:after {
    position: absolute;
    right: -20px;
    top: 0;
    height: 0;
    width: 0;
    border-bottom: 20px inset transparent;
    border-left: 20px solid #efefef;
    border-top: 20px inset transparent;
    content: "";
    z-index: 2;
  }
  
  .ty-steps__head__container__steps a {
    color: #333;
  }
  
  .ty-steps__head__container__steps a:hover {
    text-decoration: none;
  }
  
  .ty-steps__head__container__steps.clickable li:not(.active) {
    cursor: pointer;
  }
  
  .ty-steps__head__container__steps.clickable li:hover:not(.active) {
    background: #ccc;
  }
  
  .ty-steps__head__container__steps.clickable li:hover:not(.active):after {
    border-left-color: #ccc;
  }
  
  .ty-steps__head__container__steps.clickable li:hover:not(.active) a {
    color: #08c;
  }
}

.ty-steps__tabs__pane {
  overflow: auto;
  height: 100%;
}

</style>
