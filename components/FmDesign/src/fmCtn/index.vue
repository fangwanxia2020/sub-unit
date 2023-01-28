<template>
  <div class="widget-form-container">
    <div
      v-if="data.list.length == 0"
      class="form-empty"
    >从左侧拖拽来添加字段</div>
    <el-form
      :size="data.config.size"
      :label-suffix="`${typeModel=='pc'?':':''}`"
      :label-position="data.config.labelPosition"
      :label-width="formLabelWidth"
    >
      <draggable
        class
        v-model="data.list"
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200}"
        @add="handleWidgetAdd"
        @end="handleMoveEnd"
      >
        <transition-group
          name="fade"
          tag="div"
          class="widget-form-list"
        >
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'card'">
              <div
                class="widget-col widget-view"
                v-if="element && element.key"
                :key="element.key"
              >
                <el-card
                  class="box-card"
                  @click.native.stop="handleSelectWidget(index)"
                  :body-style="{ padding:`${(element.options.bodyPadding||20)}px`}"
                  :shadow="element.options.shadow"
                >
                  <div
                    slot="header"
                    v-if="element.options.showHead"
                  >
                    <span>{{element.name}}</span>
                  </div>
                  <draggable
                    v-model="element.list"
                    :no-transition-on-drag="true"
                    v-bind="{group:'people', ghostClass: 'ghost',animation: 200}"
                    @add="handleWidgetCardAdd($event,element,index)"
                  >
                    <transition-group
                      name="fade"
                      tag="div"
                      class="widget-col-list"
                    >
                      <template v-for="(el, i) in element.list">
                        <fm-ctn-item
                          :key="el.key"
                          :element="el"
                          :index="i"
                          :data="element"
                          v-if="el.key"
                        ></fm-ctn-item>
                      </template>
                    </transition-group>
                  </draggable>
                </el-card>
                <div
                  class="widget-view-action widget-col-action"
                  v-if="selectWidget.key == element.key"
                >
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
              </div>
            </template>
            <template v-else-if="element.type == 'tabs'">
              <div
                class="widget-col widget-view"
                v-if="element && element.key"
                :key="element.key"
              >
                <el-form-item
                  :label="element.name"
                  :label-width="getItemLabelWidth(element.name)"
                  @click.native="handleSelectWidget(index)"
                  title="点击编辑，拖动排序"
                >
                  <el-tabs
                    v-model="element.options.activeTab"
                    v-if="element && element.key"
                    :key="element.key"
                    :type="element.options.type"
                    :tab-position="element.options.align"
                  >
                    <el-tab-pane
                      :label="tab.label"
                      :name="tab.name"
                      v-for="(tab,index) in element.tabs"
                      :key="index"
                    >
                      <draggable
                        v-model="tab.list"
                        :no-transition-on-drag="true"
                        v-bind="{group:'people', ghostClass: 'ghost',animation: 200}"
                        @add="handleWidgetTabAdd($event, element,index)"
                      >
                        <transition-group
                          name="fade"
                          tag="div"
                          class="widget-col-list"
                        >
                          <template v-for="(el, i) in tab.list">
                            <fm-ctn-item
                              :key="el.key"
                              :element="el"
                              :index="i"
                              :data="tab"
                              v-if="el.key"
                            ></fm-ctn-item>
                          </template>
                        </transition-group>
                      </draggable>
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>
                <div
                  class="widget-view-action widget-col-action"
                  v-if="selectWidget.key == element.key"
                >
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
              </div>
            </template>
            <template v-else-if="element.type == 'grid'">
              <div :key="element.key" v-if="element && element.key">
                <grid-item :element="element" :itemIndex="index" :data="data"></grid-item>
              </div>
            </template>
            <template v-else-if="element.type == 'binding'">
              <div v-if="element && element.key" :key="element.key">
                <binding-item :element="element" :itemIndex="index" :data="data"></binding-item>
              </div>
            </template>
            <template v-else-if="element.type == 'customAttr'">
              <div v-if="element && element.key" :key="element.key">
                <custom-attr-item :element="element" :itemIndex="index" :data="data"></custom-attr-item>
              </div>
            </template>
            <template v-else>
              <fm-ctn-item
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :index="index"
                :data="data"
              ></fm-ctn-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>
<script>
import Draggable from "vuedraggable";
import FmCtnItem from "./FmCtnItem";
import gridItem from "./components/gridItem.vue";
import bindingItem from "./components/bindingItem.vue";
import customAttrItem from "./components/customAttrItem.vue";
import { eventBus } from '../eventBus/bindEventBus';
export default {
  components: {
    Draggable,
    FmCtnItem,
    gridItem,
    bindingItem,
    customAttrItem
  },
  props: ["data", "typeModel","select"],
  data() {
    return {
      selectWidget: this.select,
      aa: "1"
    };
  },
  computed: {
    formLabelWidth() {
      let ww = this.data.config.labelWidth;
      if (this.typeModel == "mobile") {
        ww = ww * 0.552;
      }
      return `${ww}px`;
    }
  },
  mounted() {
    eventBus.$on('getSelectWidget',data=>{
      this.selectWidget = data;
    });
    document.body.ondrop = function(event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    getItemLabelWidth(name) {
      return name ? "" : "0px";
    },
    getActiveTab(tab) {
      return tab && tab[0].name;
    },
    handleMoveEnd({
      newIndex,
      oldIndex
    }) {
      let selectItem = this.data.list[newIndex];
      eventBus.$emit('getSelectWidget',selectItem);
    },
    handleSelectWidget(index) {
      let selectItem = this.data.list[index];
      eventBus.$emit('getSelectWidget',selectItem);
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex;
      const to = evt.to;
      //为拖拽到容器的元素添加唯一 key + "_" + Math.ceil(Math.random() * 99999)
      const key = Date.parse(new Date());
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].component ?
          `component_${this.data.list[newIndex].options.slotName}` : (this.data.list[newIndex].type +
            "_" + key),
        prop:{
          relation:[{
            templateServiceInterfaceId:null,
            attrKey:null
          }]
        },
        rules: []
      });
      if (this.data.list[newIndex].type === "radio" || this.data.list[newIndex].type === "checkbox" || this
        .data.list[newIndex].type === "select" || this.data.list[newIndex].type === "cascader") {
        console.log(this.data.list, "----before");
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        });
        console.log(this.data.list, "----after");
      }
      if (this.data.list[newIndex].type === "grid") {
        const columns = this.data.list[newIndex].columns.map(item => ({
          ...item
        }))
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns
        });
      }
      if (this.data.list[newIndex].type === "binding") {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          list: this.data.list[newIndex].list.map(item => ({
            ...item
          })),
          childrenItemList:[]
        });
      }
      if (this.data.list[newIndex].type === "customAttr") {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          list: this.data.list[newIndex].list.map(item => ({
            ...item
          }))
        });
      }
      let selectItem = this.data.list[newIndex];
      eventBus.$emit('getSelectWidget',selectItem);
    },
    handleWidgetColAdd($event, row, colIndex) {
      console.log("coladd", $event, row, colIndex, "handleWidgetColAdd");
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;
      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf("data-grid") >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === "DIV" && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex]);
        row.columns[colIndex].list.splice(newIndex, 1);
        return false;
      }
      //console.log("from", item);
      const key = Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options
        },
        key,
        // 绑定键值
        model: row.columns[colIndex].list[newIndex].component ? `component_${row.columns[colIndex].list[
          newIndex].options.slotName}` : (row.columns[colIndex].list[newIndex].type + "_" + key),
        rules: []
      });
      if (row.columns[colIndex].list[newIndex].type === "radio" || row.columns[colIndex].list[newIndex]
        .type === "checkbox" || row.columns[colIndex].list[newIndex].type === "select" || row.columns[
          colIndex].list[newIndex].type === "cascader") {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        });
      }
      let selectItem = row.columns[colIndex].list[newIndex];
      eventBus.$emit('getSelectWidget',selectItem);
    },
    handleWidgetTabAdd($event, row, colIndex) {
      console.log("coladd", $event, row, colIndex, "handleWidgetTabAdd");
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;
      const key = Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(row.tabs[colIndex].list, newIndex, {
        ...row.tabs[colIndex].list[newIndex],
        options: {
          ...row.tabs[colIndex].list[newIndex].options
        },
        key,
        // 绑定键值
        model: row.tabs[colIndex].list[newIndex].component ? `component_${row.tabs[colIndex].list[
          newIndex].options.slotName}` : (row.tabs[colIndex].list[newIndex].type + "_" + key),
        rules: []
      });
      if (row.tabs[colIndex].list[newIndex].type === "radio" || row.tabs[colIndex].list[newIndex].type ===
        "checkbox" || row.tabs[colIndex].list[newIndex].type === "select" || row.tabs[colIndex].list[newIndex]
        .type === "cascader") {
        this.$set(row.tabs[colIndex].list, newIndex, {
          ...row.tabs[colIndex].list[newIndex],
          options: {
            ...row.tabs[colIndex].list[newIndex].options,
            options: row.tabs[colIndex].list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        });
      }
      let selectItem = row.tabs[colIndex].list[newIndex];
      eventBus.$emit('getSelectWidget',selectItem);
    },
    handleWidgetCardAdd($event, row, colIndex) {
      console.log("coladd", $event, row, colIndex, "handleWidgetCardAdd");
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;
      const key = Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(row.list, newIndex, {
        ...row.list[newIndex],
        options: {
          ...row.list[newIndex].options
        },
        key,
        // 绑定键值
        model: row.list[newIndex].component ? `component_${row.list[newIndex].options.slotName}` : (row
          .list[newIndex].type + "_" + key),
        rules: []
      });
      if (row.list[newIndex].type === "radio" || row.list[newIndex].type === "checkbox" || row.list[newIndex]
        .type === "select" || row.list[newIndex].type === "cascader") {
        this.$set(row.list, newIndex, {
          ...row.list[newIndex],
          options: {
            ...row.list[newIndex].options,
            options: row.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        });
      }
      let selectItem = row.list[newIndex];
      eventBus.$emit('getSelectWidget',selectItem);
    },
    handleWidgetDelete(index) {
      let selectItem = {}
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
    }
  },
};

</script>
<style lang="scss">
@import "../css/variable.scss";

.widget-form-container {
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  border-top: 1px solid #ddd;

  .form-empty {
    position: absolute;
    text-align: center;
    width: 300px;
    font-size: 20px;
    top: 200px;
    left: 50%;
    margin-left: -150px;
    color: #ccc;
  }
  
  .widget-form-list {
    background: #fff;
    min-height: 600px;
    margin: 10px;

    .widget-col-list {
      min-height: 50px;
      border: 1px dashed #ccc;
      background: #fff;
    }
    
    .widget-col {
      padding-bottom: 0;
      padding: 5px;
      position: relative;
      // margin-left: 2px !important;
      // margin-right: 2px !important;
      background-color: rgba(253, 246, 236, 0.3);
      border: 1px dashed transparent;

      &.active {
        background: $primary-background-color;
      }
      
      &:hover {
        border: 1px dashed rgba(170, 170, 170, 0.7);
      }
      
      .el-col {
        min-height: 50px;
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
      
      .widget-view-action {
        position: absolute;
        right: 0;
        bottom: -14px;
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
      
      &::after {
        display: none;
      }
    }
    
    .ghost {
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
  
  .ghost {
    background: $primary-select-color;
    border: 2px solid $primary-select-color;
    position: relative;

    &::after {
      background: $primary-select-color;
    }
  }
  
  li.ghost {
    height: 5px;
    list-style: none;
    font-size: 0;
    overflow: hidden;
  }
  
  .widget-grid {
    background: #f4f6fc;
    position: relative;
    border-left: 5px solid transparent;
    padding: 5px;
    margin: 0 !important;

    &.active {
      border-left: 5px solid $primary-color;
      background: #b3d8ff;
    }
  }
  
  .widget-grid-container {
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
  
  .ghost {
    background: $primary-select-color;
    border: 2px solid $primary-select-color;
    position: relative;

    &::after {
      background: $primary-select-color;
    }
  }
  
  li.ghost {
    height: 5px;
    list-style: none;
    font-size: 0;
    overflow: hidden;
  }
}

</style>
