<template>
  <!-- 单选控件 -->
  <div>
    <div :class="['item-line','mb22',{'item-height': allowUpdate}]">
      <div class="item-label" v-if="label" :style="labelStyle">
        <div>
          <em v-if="!allowNull">*</em>
          <span>{{`${label}：`}}</span>
        </div>
        <slot name="label"></slot>
      </div>
      <!-- 可以输入状态 END -->
      <template>
          <el-radio-group v-model="radio">
            <el-radio
              v-for="dict in radioOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
              :disabled="!allowUpdate"
              @change="changeValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
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
    name: 'TyRadio2',
    props: {
      radioOptions: {
        type: Array,
        required: true
      },
    },
    mixins: [secondCtlMixins],
    data() {
      return {
        radio: '', // 显示值
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.radio = val
        }
      },
    },
    methods: {
      changeValue() {
        this.$emit('update:value', this.radio);
        this.$emit('change')
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
    &.item-height {
      height: 40px;
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
        color: #f00;
      }
    }
  }
</style>
