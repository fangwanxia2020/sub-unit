<template>
  <el-row
    class="widget-col widget-view"
    type="flex"
    :class="{active: selectWidget.key == element.key}"
    :gutter="element.options.gutter ? element.options.gutter : 0"
    :justify="element.options.justify"
    :align="element.options.align"
    @click.native.stop="handleSelectWidget(itemIndex)"
  >
    <el-col
      v-for="(col, colIndex) in element.columns"
      :key="colIndex"
      :span="col.span ? col.span : 0"
    >
      <draggable
        v-model="col.list"
        :no-transition-on-drag="true"
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200}"
        @add.stop="handleWidgetColAdd($event, element, colIndex)"
      >
        <transition-group
          name="fade"
          tag="div"
          class="widget-col-list"
        >
          <template v-for="(el, i) in col.list">
            <div v-if="el && el.key" :key="el.key">
              <custom-attr-item
                v-if="el.type === 'customAttr'"
                :element="el"
                :itemIndex="i"
                :data="col"
                v-bind="$attrs"
              ></custom-attr-item>
              <fm-ctn-item
                v-else
                :key="el.key"
                :element="el"
                :index="i"
                :data="col"
                v-bind="$attrs"
              ></fm-ctn-item>
            </div>
          </template>
        </transition-group>
      </draggable>
    </el-col>
    <div
      class="widget-view-action widget-col-action"
      v-if="selectWidget.key == element.key"
    >
      <a
        href="javascript:void(0)"
        @click.stop="handleWidgetDelete(itemIndex)"
      >
        <i
          class="el-icon-remove"
          style="color:#fd5e60"
        ></i>
      </a>
    </div>
  </el-row>
</template>

<script>
  import { itemMixin } from '../mixins/itemMixin.js';
  import { eventBus } from '../../eventBus/bindEventBus';
  import customAttrItem from './customAttrItem.vue'
  export default {
    mixins: [itemMixin],
    components:{ customAttrItem },
    data() {
      return {
      }
    },
    methods:{
      handleWidgetColAdd($event, row, colIndex) {
        console.log("coladd", $event, row, colIndex, "handleWidgetColAdd111");
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
        let obj = {}
        if(row.bindChildren) {
          obj = {
            bindChildren:true,
            prop:''
          }
        } else {
          obj = {
            prop:{
              // prop:row.columns[colIndex].list[newIndex].component ? `component_${row.columns[colIndex].list[
              //   newIndex].options.slotName}` : (row.columns[colIndex].list[newIndex].type + "_" + key),
              relation:[{
                templateServiceInterfaceId:null,
                attrKey:null
              }]
            },
          }
        }
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options
          },
          key,
          // 绑定键值
          model: row.columns[colIndex].list[newIndex].component ? `component_${row.columns[colIndex].list[
            newIndex].options.slotName}` : (row.columns[colIndex].list[newIndex].type + "_" + key),
          ...obj,
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
    }
  }
</script>

<style scoped>

</style>