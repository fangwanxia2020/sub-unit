<template>
  <el-container>
    <el-header height="45px">
      <div
        class="config-tab"
        :class="{active: configTab=='widget'}"
        @click="handleConfigSelect('widget')"
      >字段属性</div>
      <div
        class="config-tab"
        :class="{active: configTab=='form'}"
        @click="handleConfigSelect('form')"
      >表单属性</div>
    </el-header>
    <el-main class="config-content">
      <fm-item-config
        v-show="configTab=='widget'"
        :data="selectWidget"
        v-bind="$attrs"
      ></fm-item-config>
      <form-config
        v-show="configTab=='form'"
        :data="data.config"
      ></form-config>
    </el-main>
  </el-container>
</template>
<script>
import FormConfig from "./FormConfig";
import FmItemConfig from "./FmItemConfig";
import { eventBus } from '../eventBus/bindEventBus';
export default {
  name: "fm-config",
  components: {
    FormConfig,
    FmItemConfig
  },
  props: ["select", "data"],
  data() {
    return {
      configTab: "form",
      selectWidget:{}
    };
  },
  watch: {
    select(val) {
      this.configTab = val ? "widget" : "form";
    }
  },
  mounted() {
    eventBus.$on('getSelectWidget',data=>{
      this.selectWidget = data;
    });
  },
  methods: {
    //属性值设置面板tab切换方法
    handleConfigSelect(value) {
      this.configTab = value;
    },
  },
};

</script>
<style lang="scss">
@import "../css/variable.scss";

.config-content .el-form-item--small {
  padding: 10px !important;
  margin-bottom: 0;
  border-bottom: 1px solid #f1f1f1;
}

.config-content {
  padding: 10px;

  .el-form-item__label {
    padding: 0;
    font-weight: 500;
  }
  
  .el-form-item {
    padding-bottom: 0;
  }
}

.config-tab {
  height: 45px;
  line-height: 45px;
  display: inline-block;
  width: 50%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  cursor: pointer;

  &.active {
    border-bottom: solid 2px $primary-color;
  }
}

</style>
