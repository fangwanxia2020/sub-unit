<template>
  <div>
    <div class="widget-col widget-view"
      :class="{active: selectWidget.key == element.key}"
      @click.stop="handleSelectWidget(itemIndex)">
      <draggable
        v-model="element.list"
        :no-transition-on-drag="true"
        v-bind="{ group: 'people', ghostClass: 'ghost', animation: 200 }"
        @add.stop="handleWidgetBindAdd($event, element)"
      >
        <transition-group name="fade" tag="div" class="widget-col-list">
          <template v-for="(child, i) in element.list">
            <div v-if="child && child.key" :key="child.key" :style="{borderStyle:element.options.borderStyle,backgroundColor:element.options.backgroundColor}" class="binding-item">
              <fm-ctn-item
                :element="child"
                :index="i"
                :data="element"
                v-bind="$attrs"
              ></fm-ctn-item>
            </div>
          </template>
        </transition-group>
      </draggable>
      <div
        class="widget-view-action widget-col-action"
        v-if="selectWidget.key == element.key"
      >
        <a href="javascript:void(0)" @click.stop="handleWidgetDelete(itemIndex)">
          <i class="el-icon-remove" style="color: #fd5e60"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { itemMixin } from "../mixins/itemMixin";
import { eventBus } from '../../eventBus/bindEventBus';
export default {
  mixins: [itemMixin],
  data() {
    return {
    }
  },
  methods: {
    handleWidgetBindAdd($event, row) {
      const newIndex = $event.newIndex;
      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(row.list, newIndex, {
        ...row.list[newIndex],
        options: {
          ...row.list[newIndex].options,
        },
        key,
        customAttrChildren:true,
        // 绑定键值
        model: row.list[newIndex].component
          ? `component_${row.list[newIndex].options.slotName}`
          : row.list[newIndex].type + "_" + key,
        prop:'',
        rules: [],
      });
      if (
        row.list[newIndex].type === "radio" ||
        row.list[newIndex].type === "checkbox" ||
        row.list[newIndex].type === "select" ||
        row.list[newIndex].type === "cascader"
      ) {
        this.$set(row.list, newIndex, {
          ...row.list[newIndex],
          options: {
            ...row.list[newIndex].options,
            options: row.list[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      }
      let selectItem = row.list[newIndex];
      eventBus.$emit('getSelectWidget',selectItem);
    },
  },
};
</script>

<style scoped lang="scss">
  .binding-item {
    border:#ccc 1px;
  }
</style>
