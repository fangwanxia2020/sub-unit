<template>
  <!-- 输入框、多行文本框控件-->
  <div :class="['item-line', 'mb22', { 'flex-align-items': !allowUpdate }]">
    <!-- 一级label START -->
    <div class="item-label" v-if="label" :style="labelStyle">
      <div>
        <em v-if="!allowNull">*</em>
        <span>{{ `${label}：` }}</span>
      </div>
      <slot name="label"></slot>
    </div>
    <!-- 一级label END -->

    <!-- 只读状态 START -->
    <template v-if="!allowUpdate">
      <div :class="['item-readonly']">
        <div class="readonly-value">
          {{ newValue ? newValue : readonlyValue }}
        </div>
        <slot></slot>
      </div>
    </template>
    <!-- 只读状态 END -->

    <!-- 可以输入状态 START -->
    <template v-if="allowUpdate">
      <el-input-number
        v-if="type === 'number'"
        v-model="newValue"
        :class="[{ 'item-error': formErrorMsg || formErrorMsg === false }]"
        controls-position="right"
        :min="minNumber"
        :max="maxNumber"
      ></el-input-number>
      <el-input
        v-else
        :type="type"
        v-model="newValue"
        :placeholder="placeholderText"
        :maxlength="maxlength"
        :clearable="clearable"
        :autosize="autosize"
        :class="[{ 'item-error': formErrorMsg || formErrorMsg === false }]"
        :readonly="!canEdit"
        :disabled="disabled"
        :show-word-limit="showWordLimitInInput"
        @blur="onBlur"
        @focus="onFocus"
      />
      <p
        class="limit-world"
        v-if="formErrorMsg"
        :style="{ marginLeft: labelStyle.width }"
      >
        <span>{{ formatError(formErrorMsg) }}</span>
      </p>
      <p
        class="limit-world"
        v-else-if="showWordLimit"
        :style="{ marginLeft: labelStyle.width }"
      >
        <span v-if="textLength > maxLimitWorld"
          >不可超过{{ maxLimitWorld }}字符</span
        >
        {{ textLength }}/{{ maxLimitWorld }}
      </p>
      <slot></slot>
    </template>
    <!-- 可以输入状态 END -->
  </div>
</template>

<script type="text/ecmascript-6">
//js
import secondCtlMixins from "@/assets/js/mixins/secondCtlMixins";

export default {
  name: "TyMultiText",
  mixins: [secondCtlMixins],
  props: {
    //提示文本
    placeholder: {
      type: String,
      default: "",
    },
    // 最大长度
    maxlength: {
      type: Number,
      require: false,
    },
    // 最小数字
    minNumber: {
      type: Number,
      default: 0,
    },
    // 最大数字
    maxNumber: {
      type: Number,
      default: Infinity,
    },
    //最大限制字数
    maxLimitWorld: {
      type: [String, Number],
      default: 10,
    },
    // 输入框类型, 可选值为text，number，textarea，password等
    type: {
      type: String,
      default: "text",
    },
    //是否允许清空
    clearable: {
      type: Boolean,
      default: false,
    },
    //是否展示字数字数
    showWordLimit: {
      type: Boolean,
      default: false,
    },
     //input内展示字数字数
    showWordLimitInInput: {
      type: Boolean,
      default: false,
    },
    //是否可以编辑(防止不可编辑需要保留之前样式框样式)
    canEdit: {
      type: Boolean,
      default: true,
    },
    // 文本框的行限制
    autosize: {
      type: Object,
      default: () => {
        return {
          minRows: 2,
          maxRows: 4,
        };
      },
    },
    //文本框禁用属性
    disabled:{
      type:Boolean,
      default:false
    }
  },
  components: {},
  watch: {
    value(val) {
      this.$emit("update:formErrorMsg", "");
    },
  },
  computed: {
    newValue: {
      get: function () {
        let value = this.value;
        if (
          this.value &&
          this.maxlength &&
          this.value.toString().length > +this.maxlength
        ) {
          value = this.value.substring(0, this.maxlength);
        }

        this.$emit("input", value);
        return value;
      },
      set: function (value) {
        this.$emit("input", value);
      },
    },
    // 当前字数
    textLength() {
      this.$emit("onMaxLimitWorld", this.newValue.length > this.maxLimitWorld);
      return this.newValue.length;
    },
    // 提示语
    placeholderText() {
      return this.placeholder
        ? this.placeholder
        : this.label
        ? `请输入${this.removeColon(this.label)}`
        : "";
    },
  },
  methods: {
    onFocus() {
      this.$emit("onFocus");
    },
  },
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~@/assets/styles/controlList/controlList.scss";
.item-line {
  position: relative;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  &.flex-align-items {
    align-items: flex-start;
  }
  .item-label {
    padding-right: 10px;
    text-align: right;
    font-size: 14px;
    color: #868a97;
    em {
      padding-left: 4px;
      color: #f56c6c;
      font-size: 14px;
    }
  }
  .el-input {
    flex: 1;
    // width: 230px;
  }
  .el-textarea {
    flex: 1;
    // width: 300px;
  }
  .el-input-number {
    flex: 1;
    // width: 230px;
  }
  .item-readonly {
    flex: 1;
    text-align: left;
    font-size: 14px;
    color: #333333;
    .readonly-value {
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .limit-world {
    width: 230px;
    text-align: right;
    color: #ccc;
    margin: 0 0 0 200px;
    font-size: 12px;
    position: absolute;
    bottom: -17px;
    span {
      float: left;
      // margin-right: .16rem;
      color: #f00;
    }
  }
}
</style>
