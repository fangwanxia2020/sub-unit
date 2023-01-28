<template>
  <div class="ty-dialog">
    <el-dialog
      :customClass="customClass"
      :title="title"
      :visible.sync="visible"
      @close="noFun"
      :show="show"
      :width="width"
      :top="top"
      v-el-drag-dialog="drag"
      @dragDialog="handleDrag"
      :append-to-body="appendToBody"
      :destroy-on-close="destroyOnClose"
    >
      <slot></slot>
      <!-- 插槽，底部菜单 -->
      <span
        v-if="showFooter"
        slot="footer"
        class="ty-dialog__footer"
      >
        <slot v-if="$slots.footer" name="footer"></slot>
        <span v-else>
          <el-button @click="noFun">{{closeText}}</el-button>
          <el-button
            type="primary"
            @click="yesFun"
          >{{okText}}</el-button>
        </span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/**
 * 组件名称 TyDialog
 * @module components/others/TyDialog
 * @desc 弹出窗组件
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Boolean} [drag]    - 是否允许拖拽
 * @param {String} [top] - Dialog CSS 中的 margin-top 值
 * @param {String} [width] - Dialog 的宽度
 * @param {Boolean} [show] - 是否显示弹出窗
 * @param {String} [title] - 弹出窗标题
 * @param {String} [okText] - 确定按钮文本
 * @param {String} [closeText] - 取消按钮文本
 * @param {Boolean} [showFooter] - 是否显示操作按钮层
 * @param {Function} [onOk] - 成功后执行方法
 * @param {Function} [onClose] - 关闭弹窗窗执行方法
 * @param {Boolean} [appendToBody] - 自身是否插入至 body 元素上
 * @param {String} [customClass] - 自定义类名
 * @example 调用示例
 *  <ty-dialog :show.sync="dialogVisible" title="dialog的标题" :onOk="onOkFun">dialog的内容</ty-dialog>
 **/
import elDragDialog from "./directive/el-drag-dialog";
export default {
  name: "TyDialog",
  directives: {
    elDragDialog
  },
  props: {
    //是否允许拖拽
    drag: {
      type: Boolean,
      default: true
    },
    //Dialog CSS 中的 margin-top 值
    top: {
      type: String,
      default: "15vh"
    },
    //Dialog 的宽度
    width: {
      type: String,
      default: "500px"
    },
    //是否显示弹出窗
    show: {
      type: Boolean,
      default: false
    },
    //弹出窗标题
    title: {
      type: String,
      default: "标题"
    },
    //确定按钮文本
    okText: {
      type: String,
      default: "确 定"
    },
    //取消按钮文本
    closeText: {
      type: String,
      default: "取 消"
    },
    //是否显示操作按钮层
    showFooter: {
      type: Boolean,
      default: true
    },
    //成功后执行方法
    onOk: {
      type: Function
    },
    //关闭弹窗窗执行方法
    onClose: {
      type: Function
    },
    //Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
    appendToBody: {
      type: Boolean,
      default: false
    },
    //Dialog 的自定义类名
    customClass: {
      type: String,
      default: ""
    },
    //关闭时销毁 Dialog 中的元素
    destroyOnClose:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      visible: this.show
    };
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  mounted() {},
  methods: {
    handleDrag() {
      this.$refs.select && this.$refs.select.blur();
    },
    closeDialog() {
      this.$emit("update:show", false);
    },
    async yesFun() {
      //const aa= await this.$emit("onOk");
      if (this.onOk) {
        const aa = await this.onOk();
        aa && this.closeDialog();
      }
      else {
        this.closeDialog();
      }
    },
    async noFun() {
      // this.$emit("onClose");
      // this.closeDialog();
      if (this.onClose) {
        const aa = await this.onClose();
        aa && this.closeDialog();
      }
      else {
        this.closeDialog();
      }
    }
  }
};

</script>
<style scoped>
</style>
