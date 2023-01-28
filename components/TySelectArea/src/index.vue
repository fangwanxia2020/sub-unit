<template>
  <div class="ty-select-area">
    <el-cascader
      :style="{width:`${width}`}"
      :size="size"
      :clearable="clearable"
      :options="options"
      :value="value"
      @change="handleChange"
      :disabled="disabled"
      :placeholder="placeholder"
    ></el-cascader>
  </div>
</template>
<script>
/**
 * 组件名称 TySelectArea
 * @module components/business/TySelectArea
 * @desc 选择地区
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Array} [value]    - 选中的值
 * @param {String} [width] - 宽度
 * @param {Boolean} [disabled] - 是否禁用
 * @param {String} [size] - 组件大小
 * @param {String} [placeholder] - 占位文本
 * @param {String} [type] - 类型，city：市  area:区
 * @example 调用示例
 *  <ty-select-area v-model="area"></ty-select-area>
 **/
import {
  regionData,
  provinceAndCityData
}
from "element-china-area-data";
export default {
  name: "TySelectArea",
  props: {
    //选中的值
    value: {
      type: Array,
      default: () => []
    },
    //宽度
    width: {
      type: String,
      default: "320px"
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    //大小
    size: {
      type: String,
      default: "large"
    },
    //占位文本
    placeholder: {
      type: String,
      default: "请选择"
    },
    //选择的最后节点city：市  area:区
    type: {
      type: String,
      default: "area"
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    type(val) {
      this.options = val == "area" ? regionData : provinceAndCityData;
    }
  },
  data() {
    return {
      options: this.type == "area" ? regionData : provinceAndCityData
    };
  },
  methods: {
    handleChange(value) {
      this.triggerChange(value);
    },
    triggerChange(changedValue) {
      this.$emit("input", changedValue);
    },
    //获取当前选择字段的中文
    getText() {
      let text = "";
      let childArr = this.options.concat([]);
      this.value.forEach(item => {
        const obj = childArr.find(o => o.value == item);
        if (obj) {
          text += obj.label;
          childArr = obj.children || [];
        }
      });
      return text;
    }
  }
};

</script>
