<template>
  <div class="components-list">
    <el-tabs
      v-model="activeName"
      class="menu-tab"
    >
      <el-tab-pane
        :label="getMenuTit(key)"
        :name="`${index}`"
        v-for="(value, key, index) in fmMenu"
        :key="index"
      >
        <draggable
          tag="ul"
          :list="JSON.parse(JSON.stringify(value))"
          v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
        >
          <li
            class="form-edit-widget-label"
            :class="{'no-put': item.type == 'divider'}"
            v-for="(item, index) in value"
            :key="index"
          >
            <a>
              <i
                class="icon iconfont"
                :class="item.icon"
              ></i>
              <span>{{item.name}}</span>
            </a>
            <span
              class="flagTip"
              v-if="item.flag&&item.flag!=0"
            >
              <i
                class="el-icon-monitor"
                v-if="item.flag==1"
              ></i>
              <i
                class="el-icon-mobile"
                v-else
              ></i>
            </span>
          </li>
        </draggable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "./iconfont/iconfont.css";
import Draggable from "vuedraggable";
import Components from "./json/componentsConfig.js";
export default {
  name: "fm-making-form",
  components: {
    Draggable
  },
  computed: {
    fmMenu() {
      const coms = Components[this.typeModel];
      const businessComs = this.fmDesign.businessComponent[this.typeModel] || [];
      if (businessComs && businessComs.length > 0) {
        coms['business'] = businessComs
      }
      return coms;
    }
  },
  inject: ['fmDesign'],
  watch: {
    typeModel() {
      this.activeName = "0";
    },
  },
  props: {
    typeModel: {
      type: String,
      default: "pc"
    }
  },
  data() {
    return {
      activeName: '0'
    };
  },
  mounted() {},
  methods: {
    getMenuTit(key) {
      let menuTit = "";
      switch (key) {
        case "layout":
          menuTit = "布局";
          break;
        case "business":
          menuTit = "业务组件";
          break;
        default:
          menuTit = "组件";
          break;
      }
      return menuTit;
    },
  }
};

</script>
<style
  scoped
  lang="scss"
>
.menu-tab ::v-deep {
  .el-tabs__nav-wrap {
    padding: 0 10px;
  }
  
  .el-tabs__header {
    margin-bottom: 1px;
  }
}

</style>
<style lang="scss">
@import "./css/variable.scss";

.components-list {
  width: 100%;

  .widget-cate {
    padding: 5px 12px;
    font-size: 16px;
    background: $primary-background-color;
  }
  
  ul {
    position: relative;
    overflow: hidden;
    padding: 0 0 10px;
    margin: 0;
  }
  
  .form-edit-widget-label {
    font-size: 12px;
    display: block;
    width: 50%;
    height: 54px;
    line-height: 26px;
    position: relative;
    float: left;
    left: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
    border: 1px solid #f4f6fc;
    box-sizing: border-box;

    .flagTip {
      position: absolute;
      top: 0;
      right: 0;
      background: #F56C6C;
      color: #fff;
      font-size: 16px;
      line-height: 20px;
      height: 20px;
      border-radius: 3px;
      padding: 0 3px;
    }
    
    &:hover {
      color: $primary-color;
      border: 1px dashed $primary-color;
    }
    
    &>a {
      display: block;
      text-align: center;
      color: #666;
      cursor: move;

      .icon {
        margin: 5px 0 0;
        font-size: 18px;
        display: block;
      }
      
      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
      }
    }
  }
}

</style>
