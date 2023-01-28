<!--
	复选框组件	
	@author lyt
	@date 2020-12-25
	@since 1.0.0 
	@describe 
-->
<template>
  <div class="ty-checkbox">
    <el-checkbox-group
      @change="checkboxChange"
      v-model="checkedValue"
      :style="{width:width}"
      :disabled="disabled"
    >
      <el-checkbox
        :style="{display:inline ? 'inline-block' : 'block'}"
        :label="item.value"
        v-for="(item, index) in list"
        :key="index"
      >
        <template v-if="remote">{{item.label}}</template>
        <template v-else>{{showLabel ? item.label : item.value}}</template>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
import {
  apiGetList
}
from "./api.js";
export default {
  name: 'TyCheckbox',
  components: {},
  props: {
    //值
    value: {
      default: []
    },
    //选择列表数据
    options: {
      type: Array,
      default: () => []
    },
    //是否是完整的键值对值返回
    isAllValue: {
      type: Boolean,
      default: false
    },
    //禁用
    disabled: {
      type: Boolean,
      default: false
    },
    //宽度
    width: {
      type: String,
      default: "100%"
    },
    //inline是否行内布局
    inline: {
      type: Boolean,
      default: false
    },
    //是否显示label形式
    showLabel: {
      type: Boolean,
      default: true
    },
    //是否获取远程数据
    remote: {
      type: Boolean,
      default: false
    },
    //接口地址
    interfaceMethod: {
      type: String,
      default: ""
    },
    //接口类型
    interfaceType: {
      type: String,
      default: "get"
    },
    //接口参数
    interfaceParam: {
      default: ""
    },
    //格式化数据,为了后续掉的接口数据不一致留的一个入口
    formatData: {
      type: Function,
      default: null
    },
    //选项的标签值名称
    optItem: {
      type: Object,
      default: () => {
        return {
          value: "value",
          label: "label"
        }
      }
    },
    //请求返回值的list数据
    resList: {
      type: String,
      default: "data.records"
    }
  },
  data() {
    return {
      list: this.options,
      checkedValue: []
    }
  },
  computed: {
    allArrVal() {
      return this.getAllArrFun(this.value);
    }
  },
  watch: {
    value(val) {
      this.checkedValue = this.getValueFun(val);
    },
  },
  mounted() {
    //组装选项是远程数据的项
    if (this.remote) {
      this._getOptionDataFun();
    }
    this.checkedValue = this.getValueFun(this.value);
  },
  methods: {
    //获取value值
    getValueFun(val) {
      if (val == 'undefined') {
        val = "";
      };
      return (val || []).map(item => {
        if (item.constructor === Object) {
          return item.value;
        }
        else {
          return item;
        }
      });
    },
    //切换复选框
    checkboxChange(evt) {
      let value = evt.target ? evt.target.value : evt;
      if (this.isAllValue) {
        value = this.getAllArrFun(value);
      }
      this.$emit("change", value);
      this.$emit("input", value);
    },
    //获取完整的键值对
    getAllArrFun(val) {
      if (!val) return [];
      return val.map(item => {
        let itemObj = {};
        if (item.constructor === Object) {
          itemObj = item;
        }
        else {
          const o = this.list.find(obj => obj.value == item);
          itemObj = {
            value: item,
            label: (o && o.label) || item
          };
        }
        return itemObj;
      })
    },
    //获取远端数据
    _getOptionDataFun() {
      this.list = [];
      let data = this.interfaceParam;
      if (data && (typeof data == "string")) {
        data = JSON.parse(data);
      }
      apiGetList(this.interfaceMethod, data, this.interfaceType).then(res => {
        if (this.formatData) {
          this.list = this.formatData(res);
        }
        else {
          let list = res;
          if (this.resList) {
            const bb = this.resList.split(".");
            bb.forEach(i => {
              list = list[i];
            });
          }
          if (list && list.length > 0) {
            this.list = list.map(item => {
              return {
                value: item[this.optItem.value],
                label: item[this.optItem.label]
              };
            });
          }
        }
      });
    }
  }
}

</script>
<style
  lang="scss"
  scoped
>
.ty-checkbox {}

</style>
