<template>
  <i
    :class="['tyicon',`tyicon-${type}`]"
    :style="{'font-size': `${size}px`,color:colorStyle}"
  ></i>
</template>
<script>
/**
 * 组件名称 TyIcon
 * @module components/base/TyIcon
 * @desc 扩展element ui库的图标，满足业务需求
 * @author lyt
 * @date 2020年06月09日 15:00
 * @param {Object} [type]    - 类型，字体的样式
 * @param {Number} [size] - 字体图片大小
 * @example 调用示例
 *  <ty-icon type="hamburger"></ty-icon>
 **/
import "./_iconfont.less";
export default {
  name: "TyIcon",
  data() {
    return {};
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 24
    },
    //颜色
    color: {
      type: String,
      default: "inherit"
    }
  },
  computed: {
    colorStyle() {
      let col = this.color || "inherit";
      switch (this.type) {
        case "wechat":
          col = "#07C160";
          break;
        case "alipay":
          col = "#06B4FD";
          break;
        case "money":
          col = "#f90";
          break;
      }
      return col;
    }
  },
  watch: {},
  mounted() {},
  methods: {}
};

</script>
<style
  lang="scss"
  scoped
>
</style>
