<template>
  <el-select
    class="ty-dictionary"
    :size="size"
    :value="value1"
    :placeholder="placeholder"
    :filterable="filterable"
    :clearable="clearable"
    :style="{ width }"
    :multiple="multiple"
    :disabled="disabled"
    @change="changeInput"
    @click.native="$emit('click', $event)"
  >
    <template v-for="item in list">
      <!-- 解决类型不匹配导致选不中的问题 -->
      <el-option
        v-if="typeof value1 == 'string'"
        :key="item.value"
        :label="item.label"
        :value="'' + item.value"
      ></el-option>
      <el-option
        v-else-if="typeof value1 == 'number'"
        :key="item.value"
        :label="item.label"
        :value="('' + item.value).trim() == '' ? '' : parseInt(item.value)"
      ></el-option>
      <el-option
        v-else
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </template>
  </el-select>
</template>
<script>
/**
 * 组件名称 TyDictionary
 * @module components/form/TyDictionary
 * @desc 下拉框/数据字典组件
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Boolean} [disabled]    - 是否可编辑
 * @param {String, Number, Array} [value] - 选中值
 * @param {String} [placeholder] - 文本占位提示语
 * @param {String} [width] - 宽度
 * @param {String} [action] - 请求地址
 * @param {all} [actionParams] - 请求参数
 * @param {Function} [formatData] - 格式化数据
 * @param {Boolean} [multiple] - 多选模式
 * @example 调用示例
 *   <ty-dictionary :actionParams="{dictType:'sys_tenant_type'}" v-model="selectVal1"></ty-dictionary>
 **/
import { getChildrenItemsByDictType } from './api'
export default {
  name: 'TyDictionary',
  props: {
    //尺寸
    size: {
      type: String,
      default: 'medium',
    },
    //选择列表数据
    options: {
      type: Array,
      default: () => [],
    },
    //是否显示清除图标
    clearable: {
      type: Boolean,
      default: false,
    },
    //是否有过滤功能
    filterable: {
      type: Boolean,
      default: false,
    },
    //是否是完整的键值对值返回
    isAllValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      //不可编辑
      type: Boolean,
      default: false,
    },
    //选中值
    value: {
      type: [String, Number, Array, Object],
    },
    //文本占位提示语
    placeholder: {
      type: String,
      default: '请选择',
    },
    //宽度
    width: {
      type: String,
      default: '600px',
    },
    //请求地址
    action: {
      type: String,
      default: '',
    },
    //请求参数{dictType:"sys_user_sex"}
    actionParams: {
      default: '',
    },
    //选项的标签值名称
    optItem: {
      type: Object,
      default: () => {
        return {
          value: 'dictValue',
          label: 'dictLabel',
        }
      },
    },
    //请求返回值的list数据
    resList: {
      type: String,
      default: 'data.records',
    },
    //格式化数据,为了后续掉的接口数据不一致留的一个入口
    formatData: {
      type: Function,
      default: null,
    },
    //接口类型
    interfaceType: {
      type: String,
      default: 'get',
    },
    //是否获取远程数据
    remote: {
      type: Boolean,
      default: true,
    },
    //多选模式
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: this.options,
      value1: this.formatValueFun(this.value),
      interfaceRes: null,
    }
  },
  computed: {},
  watch: {
    value(val) {
      this.value1 = this.formatValueFun(val)
    },
    interfaceParam: {
      deep: true,
      handler(val) {
        if (this.remote) {
          this._getOptionsData()
        }
      },
    },
    options: {
      handler(val) {
        this.list = val
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    //组装选项是远程数据的项
    if (this.remote) {
      this._getOptionsData()
    }
  },
  methods: {
    //获取接口的返回信息
    getInterfaceRes() {
      return this.interfaceRes
    },
    //判断对象与否获取值
    getValueFun(item) {
      if (Object.prototype.toString.call(item) === '[object Object]') {
        return item.value
      } else {
        return item
      }
    },
    //格式化值
    formatValueFun(value) {
      if (!value) {
        return this.multiple ? [] : value
      }
      if (this.multiple) {
        return value.map((item) => {
          return this.getValueFun(item)
        })
      } else {
        return this.getValueFun(value)
      }
    },
    //请求后端数据
    _getOptionsData() {
      let data = this.actionParams
      if (data && typeof data == 'string') {
        data = JSON.parse(data)
      }
      getChildrenItemsByDictType(this.action, data, this.interfaceType).then(
        (res) => {
          this.$emit('getResponse', res)
          this.interfaceRes = res
          if (this.formatData) {
            this.list = this.formatData(res)
          } else {
            let list = res
            if (this.resList) {
              const bb = this.resList.split('.')
              bb.forEach((i) => {
                list = list[i]
              })
            }
            this.list = (list || []).map((item) => {
              return {
                value: item[this.optItem.value],
                label: item[this.optItem.label],
              }
            })
          }
        }
      )
    },
    triggerChange(changedValue) {
      this.value1 = changedValue
      let vv = changedValue
      if (this.isAllValue) {
        if (this.multiple) {
          vv = vv.map((item) => {
            const label = this.list.find((o) => o.value == item).label
            return {
              label: label,
              value: item,
            }
          })
        } else {
          const label = this.list.find((o) => o.value == vv)?.label
          vv = {
            label: label,
            value: vv,
          }
        }
      }
      this.$emit('change', vv)
      this.$emit('input', vv)
    },
    changeInput(value) {
      this.triggerChange(value)
    },
  },
}
</script>
