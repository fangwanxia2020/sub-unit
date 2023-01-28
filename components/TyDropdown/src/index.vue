<template>
  <!-- 下拉菜单控件 -->
  <div>
    <div :class="['item-line','mb22',{'flex-align-items': !allowUpdate}]">
      <!-- 一级label START -->
      <div class="item-label" v-if="label" :style="labelStyle">
        <div>
          <em v-if="!allowNull">*</em>
          <span>{{`${label}：`}}</span>
        </div>
        <slot name="label"></slot>
      </div>
      <!-- 一级label END -->

      <!-- 只读状态 START -->
      <template v-if="!allowUpdate">
        <div :class="['item-readonly']">
          <div>{{ getShowValue ? getShowValue  : readonlyValue}}</div>
          <slot></slot>
        </div>
      </template>
      <!-- 可以输入状态 END -->
      <template v-else>
          <el-select
          v-model="showValue"
          :placeholder="placeholderText"
          :class="[{'item-error':formErrorMsg || formErrorMsg === false}]"
          @visible-change="visibleChange($event)"
          @change="changeValue"
          >
            <el-option
              v-for="item in fieldMapperList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
           <p
            class="limit-world"
            v-if="formErrorMsg"
            :style="{marginLeft: labelStyle.width}"
          >
            <span>{{formatError(formErrorMsg,'选择')}}</span>
          </p>
      </template>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import secondCtlMixins from '@/assets/js/mixins/secondCtlMixins';

  export default {
    name: 'TyDropdown',
    props: {
      fieldMapperList: {
        type: Array,
        required: true
      },
    },
    mixins: [secondCtlMixins],
    data() {
      return {
        showValue: '', // 显示值
      }
    },
    computed: {
      getShowValue() {
        let dictLabel = '';
        if((this.fieldMapperList && this.showValue) || this.showValue === 0) {
          this.fieldMapperList.forEach((n) => {
            if(n.dictValue === this.showValue) {
                dictLabel = n.dictLabel
             }
          });
        }
        return dictLabel
      },
      placeholderText() {
        return this.placeholder ? this.placeholder : this.label ? `请选择${this.removeColon(this.label)}` : '';
      },
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.showValue = val
          if (val) {
            this.onBlur();
          }
        }
      },
    },
    methods: {
      /**
       * @description: 下拉选择改变showValue触发
       * @param {*}
       * @return {*}
       */
      changeValue() {
        this.$emit('update:value', this.showValue);
        this.$emit('change')
      },
      /**
       * @description: 点击下拉触发
       * @param {*} callback
       * @param {*} vc
       * @return {*}
       */
      visibleChange(callback,vc) {
        if(!callback) {
          this.onBlur();
        }
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/less">
    @import "~@/assets/styles/controlList/controlList.scss";
  .item-line {
    position: relative;
    flex-wrap:wrap;
    display: flex;
    align-items: center;
    &.flex-align-items {
      align-items: flex-start;
    }
    .item-label {
      padding-right: 10px;
      text-align: right;
      font-size: 14px;
      color: #868A97;
      em {
        padding-left: 4px;
        color: #F56C6C;
        font-size: 14px;
      }
    }
    ::v-deep .el-select{
      flex: 1;
      .el-input {
        width: 100%;
      }
      // width: 230px;
    }
    .item-readonly {
      text-align: left;
      font-size: 14px;
      color: #333333;
    }
    .limit-world {
      width: 230px;
      text-align: right;
      color: #ccc;
      margin: 0px;
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
