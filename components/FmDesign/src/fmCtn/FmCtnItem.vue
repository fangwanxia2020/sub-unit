<template>
  <el-form-item
    class="widget-view"
    v-if="element && element.key"
    :class="[borderRadiusItem,
    {active: selectWidget.key == element.key, 
    'is_req': element.options.required,
    'titleCom':element.type=='title'||element.component==true,
    'formItemOBJ':element.type!='title'}]"
    :label="element.name"
    :label-width="itemLabelWidth"
    @click.native.stop="handleSelectWidget(index)"
    title="点击编辑，拖动排序"
  >
    <p
      class="form-title"
      v-if="element.type=='title'"
    >
      <el-link type="primary"><span>{{element.name}}</span></el-link>
    </p>
    <render-item
      v-else
      :widget="element"
      :value="element.options.defaultValue"
    />
    <p
      v-if="element.options.tipFont"
      class="fmItem__tip"
    >{{element.options.tipFont}}</p>
    <div
      class="widget-view-action"
      v-if="selectWidget.key == element.key"
    >
      <a
        href="javascript:void(0)"
        @click.stop="handleWidgetClone(index)"
      >
        <i class="el-icon-circle-plus"></i>
      </a>
      <a
        href="javascript:void(0)"
        @click.stop="handleWidgetDelete(index)"
      >
        <i
          class="el-icon-remove"
          style="color:#fd5e60"
        ></i>
      </a>
    </div>
    <div class="widget-view-drag drag-widget">
      <i class="el-icon-rank"></i>
    </div>
  </el-form-item>
</template>
<script>
import RenderItem from "components/PcForm/src/RenderItem";
import { eventBus } from '../eventBus/bindEventBus';

export default {
  props: ["element", "index", "data", "parentData"],
  components: {
    RenderItem
  },
  data() {
    return {
      selectWidget: {},
    };
  },
  computed: {
    borderRadiusItem() {
      return `borRadius_${this.element.options.borderRadius}`
    },
    itemLabelWidth() {
      let val = "0px";
      if (this.element.name) {
        val = "";
      }
      if (this.element.type == 'title' || this.element.component==true) {
        val = "0px";
      }
      return val;
    }
  },
  mounted() {
    eventBus.$on('getSelectWidget',data=>{
      this.selectWidget = data;
    });
  },
  methods: {
    handleSelectWidget(index) {
      console.log(index, "111#####handleSelectWidget");
      let selectItem = this.data.list[index];
      eventBus.$emit('getSelectWidget',selectItem);
    },
    handleWidgetDelete(index) {
      let selectItem = {};
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          selectItem = {};
        }
        else {
          selectItem = this.data.list[index - 1];
        }
      }
      else {
        selectItem = this.data.list[index + 1];
      }
      eventBus.$emit('getSelectWidget',selectItem);
      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      let cloneData = {
        ...this.data.list[index],
        options: {
          ...this.data.list[index].options
        },
        key: Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999)
      };
      if (this.data.list[index].type === "radio" || this.data.list[index].type === "checkbox" || this.data
        .list[index].type === "select") {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({
              ...item
            }))
          }
        };
      }
      this.data.list.splice(index, 0, cloneData);
      this.$nextTick(() => {
        let selectItem = this.data.list[index + 1];
        eventBus.$emit('getSelectWidget',selectItem);
      });
    }
  },
  watch: {
    parentData: {
      handler(newValue) {
        let list = newValue ? newValue.childrenItemList : []
        eventBus.$emit('getParentData',list);
      },
      immediate:true,
      deep: true
    }
  }
};

</script>
<style lang="scss">
@import "../css/variable.scss";

.el-form-item.widget-view {
  padding-bottom: 18px;
  position: relative;
  border: 1px dashed transparent;
  margin: 2px;

  &.titleCom {
    padding: 0;

    .el-form-item__label {
      text-align: left;
      display: none;
    }
    
    .form-title {
      padding: 0;
      margin: 0;
    }
  }
  
  .el-form-item__content {
    position: unset;
  }
  
  &.is_req {
    .el-form-item__label::before {
      content: "*";
      color: $primary-select-color;
      margin-right: 4px;
    }
  }
  
  .widget-view-description {
    height: 15px;
    line-height: 15px;
    font-size: 13px;
    margin-top: 6px;
    color: #909399;
  }
  
  .widget-view-action {
    position: absolute;
    right: -3px;
    bottom: -3px;
    height: 28px;
    line-height: 28px;
    z-index: 9;

    a {
      display: inline-block;
      text-decoration: none;
      color: #fff;
    }
    
    i {
      margin: 0 !important;
      font-size: 20px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
      color: $primary-color;
    }
  }
  
  .widget-view-drag {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: 30px;
    background: #eee;
    z-index: 9;
    display: none;
    width: 30px;
    text-align: center;
    line-height: 30px;

    i {
      color: #999;
      font-size: 14px;
      margin: 0 0;
      cursor: move;
    }
  }
  
  &:after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
  }
  
  &:hover {
    border: 1px dashed rgba(170, 170, 170, 0.7);
  }
  
  &.active {
    background: $primary-background-color;
  }
  
  &.ghost {
    background: $primary-select-color;
    border: 2px solid $primary-select-color;
    outline-width: 0;
    height: 3px;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
  }
}

.fmItem__tip {
  color: #999;
  padding: 5px 0 0;
  margin: 0;
  font-size: 12px;
  line-height: 18px;
}

</style>
