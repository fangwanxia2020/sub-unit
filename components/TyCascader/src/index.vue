<template>
  <div
    class="ty-cascader"
    :class="{hasValue:initValueState}"
  >
    <!-- 为了让元素触发验证 -->
    <el-input
      v-model="updateVal"
      v-show="false"
    />
    <!-- 为了让元素触发验证 -->
    <template v-if="optionDataType == 2 && lazyLoad">
      <!-- :value="value" 使用value参数会导致页面报错-->
      <el-cascader
        :disabled="disabled"
        :clearable="clearable"
        :multiple="multiple"
        ref="myCascader"
        :expandTrigger="true"
        :placeholder="selectedOptionsName"
        :props="props"
        :style="{width:width}"
        @change="changeFun"
        :show-all-levels="showAllLevels"
        v-if="updateVisible"
        popper-class="ty-cascader__content"
      ></el-cascader>
    </template>
    <template v-else-if="optionDataType == 3 || optionDataType == 4">
      <el-cascader
        :disabled="disabled"
        :clearable="clearable"
        ref="myCascader"
        :expandTrigger="true"
        :placeholder="selectedOptionsName"
        :props="propsRegion"
        v-model="selectedOptions"
        :options="regionList"
        :style="{width:width}"
        @change="getaddrId"
        :show-all-levels="showAllLevels"
        popper-class="ty-cascader__content"
      ></el-cascader>
    </template>
    <template v-else>
      <el-cascader
        :clearable="clearable"
        :disabled="disabled"
        :props="commonProps"
        ref="myCascader"
        :placeholder="selectedOptionsName"
        :show-all-levels="showAllLevels"
        :style="{width:width}"
        :value="value1"
        :options="list"
        @change="changeInput"
        :multiple="multiple"
      ></el-cascader>
    </template>
  </div>
</template>
<script>
/**
 * 组件名称 TyCascader  
 * @module components/form/TyCascader
 * @desc 级联选择组件
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Boolean} [disabled]    - 是否可以编辑
 * @param {Boolean} [showAllLevels]    - 是否显示多级
 * @param {String, Number, Array} [value] - 选中值
 * @param {String} [placeholder] - 文本占位提示语
 * @param {String} [width] - 宽度
 * @param {String} [action] - 请求地址
 * @param {Object} [actionParams] - 请求参数{dictType:"sys_user_sex"}
 * @param {Function} [formatData] - 格式化数据,为了后续掉的接口数据不一致留的一个入口
 * @example 调用示例
 *   <ty-cascader
        width="380px"
        :actionParams="{isDefault:radio}"
        v-model="aa1"
        :showAllLevels="true"
      ></ty-cascader>
 **/
import {
  getGoodsItemLists
}
from "./api";
import area from 'utils/json/area';
import city from 'utils/json/city';
import { getParent } from 'utils/common';
import { isArray } from "../../../utils/common";
let findTreeResult = {};
export default {
  name: "TyCascader",
  props: {
    //返回的数据是否是数组
    dataIsArray: {
      type: Boolean,
      default: false
    },
    //是否显示清除图标
    clearable: {
      type: Boolean,
      default: false
    },
    //是否是完整的键值对值返回,只能生效在静态数据模式或者是lazyLoad为false时
    isAllValue: {
      type: Boolean,
      default: true
    },
    //选择列表数据
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      //不可编辑
      type: Boolean,
      default: false
    },
    //是否显示多级
    showAllLevels: {
      type: Boolean,
      default: true
    },
    //选中值
    value: {
      type: [String, Number, Array],
      default: () => []
    },
    //文本占位提示语
    placeholder: {
      type: String,
      default: "请选择"
    },
    //宽度
    width: {
      type: String,
      default: "600px"
    },
    //接口类型
    interfaceType: {
      type: String,
      default: "get"
    },
    //请求地址
    action: {
      type: String,
      default: ""
    },
    //请求参数{dictType:"sys_user_sex"}
    actionParams: {
      default: ""
    },
    //格式化数据,为了后续掉的接口数据不一致留的一个入口
    formatData: {
      type: Function,
      default: null
    },
    //取消默认的传参，就是组件内部的参数，在lazy加载时生效
    cancelDefaultParams: {
      type: Boolean,
      default: false
    },
    //请求返回值的list数据
    resList: {
      type: String,
      default: "data.records"
    },
    //选项的标签值名称
    optItem: {
      type: Object,
      default: () => {
        return {
          value: "id",
          label: "itemName"
        }
      }
    },
    //是否获取远程数据
    optionDataType: {
      type: Number || String,
      default:0
    },
    //是否懒加载
    lazyLoad: {
      type: Boolean,
      default: true
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    //父级code，通过它可以获取整个父级的id字符串,一般会在多选中使用到
    parentIdsCode:{
      type: String,
      default:"parentCode"
    }
  },
  computed: {
    selectedOptionsName() {
      if (this.initValueState && this.selectedOptions && this.selectedOptions.length > 0) {
        return this.selectedOptions.map(i => i.label).join("/");
      }
      else {
        return this.placeholder;
      }
    }
  },
  watch: {
    value: {
      handler: function(newVal) {
        if(this.optionDataType == 3 || this.optionDataType == 4) {
          if(this.dataIsArray) {
            this.selectedOptions = newVal
          } else {
            this.selectedOptions = getParent(newVal, "addrCodeId");
          }
          
        } else {
          this.selectedOptions = newVal;
          this.value1 = this.formatValueFun(this.value)
        }
        
      },
      deep: true
    },
    // optionDataType(value) {
    //   console.log(value);
    // }
  },
  data() {
    return {
      updateVal: new Date().getTime(),
      value1: null,
      list: this.options,
      regionList:[],
      updateVisible: true,
      initValueState: this.value && this.value.length > 0, //初始化值状态
      selectedOptions: this.value, //初始化时记录的值
      isShowCascader: false,
      propsRegion:{
        label: "addrName",
        value: "addrCodeId",
        children: "children",
      },
      commonProps:{
        multiple: this.multiple,
      },
      props: {
        value: this.isAllValue ? "all" : "value",
        lazy: true,
        multiple: this.multiple,
        lazyLoad: (node, resolve) => {
          const {
            level,
            data
          } = node;
          if (this.initValueState && data) {
            const vv = this.selectedOptions.map((i, index) => {
              if (i.value == data.value) {
                return data;
              }
              return i;
            });
            this.selectedOptions = vv;
          }
          this.getOptionsDataFun(data, resolve);
        }
      }
    };
  },
  async mounted() {
    if (this.optionDataType == 2 && (!this.lazyLoad)) {
      await this._getOptions();
    } else if(this.optionDataType == 3) {
      this.regionList = area
    } else if(this.optionDataType == 4) {
      this.regionList = city
    }
  },
  methods: {
    //格式化options数据
    formatTreeFun(arr) {
      for (var item = 0; item < arr.length; item++) {
        const label = arr[item][this.optItem.label];
        const value = arr[item][this.optItem.value];
        const obj = {
          ...arr[item]
        };
        arr[item] = {
          label,
          value,
          ...obj
        };
        if (obj.children) {
          arr[item].children = obj.children;
        }
        if (arr[item].children) {
          this.formatTreeFun(arr[item].children)
        }
      }
      return arr
    },
    //后端请求option,lazyLoad:false
    async _getOptions() {
      let param = {};
      let actionParamsData = this.actionParams;
      if (actionParamsData && (typeof actionParamsData == "string")) {
        actionParamsData = JSON.parse(actionParamsData);
      }
      if (actionParamsData) {
        param = {
          ...actionParamsData
        };
      }
      let res = await getGoodsItemLists(this.action, param, this.interfaceType)
      let vv = [];
      if (this.formatData) {
        vv = this.formatData(res);
      }
      else {
        let list = res;
        if (this.resList) {
          const bb = this.resList.split(".");
          bb.forEach(i => {
            list = list[i];
          });
        }
        vv = this.formatTreeFun(list || []);
      }
      this.list = vv;
      this.value1 = this.formatValueFun(this.value)
    },
    //判断对象与否获取值
    getValueFun(item) {
      if (Object.prototype.toString.call(item) === '[object Object]') {
        return item.value;
      }
      else {
        return item;
      }
    },
    //处理多选请求下，返回的数据再回显
    formatMultipleData(list,value,array) {
      if(value && value.length > 0) {
        if(isArray(value[0])){
          list = value
          return
        }
        list.forEach(item=>{
          if(item.children && item.children.length>0) {
            this.formatMultipleData(item.children,value,array)
          } else {
            if(value.includes(item[this.optItem.value])) {
              let parentIdList = item[this.parentIdsCode].split(',')
              parentIdList = parentIdList.map(item=>{
                return Number(item)
              })
              array.push(parentIdList)
            }
          }
        })
      } 
    },
    //格式化值
    formatValueFun(value) {
      if (!value) {
        return [];
      }
      if(this.multiple) {
        let _value = value.map(item=>{
          return Number(item)
        })
        let list = []
        console.log(_value,'_value')
        console.log(this.list,'this.list')
        this.formatMultipleData(this.list,_value,list)
        console.log(list,'list')
        return list
      }
      return value.map(item => {
        return this.getValueFun(item);
      });
    },
    //递归获取
    getTreeItem(data, value) {
      data.map(item => {
        if (item.value == value) {
          findTreeResult = item; // 结果赋值
        }
        else {
          if (item.children) {
            this.getTreeItem(item.children, value);
          }
        }
      });
    },
    //请求后端获取数据
    _getOptionsData(param) {
      return new Promise((resolve, reject) => {
        getGoodsItemLists(this.action, param, this.interfaceType).then(res => {
          let vv = [];
          if (this.formatData) {
            vv = this.formatData(res);
          }
          else {
            let list = res;
            if (this.resList) {
              const bb = this.resList.split(".");
              bb.forEach(i => {
                list = list[i];
              });
            }
            vv = (list || []).map(item => {
              const {
                level
              } = item;
              const listItem = {
                label: item[this.optItem.label],
                value: item[this.optItem.value],
              };
              listItem.all = JSON.parse(JSON.stringify(listItem));
              if (level >= 3) {
                listItem.leaf = true;
              }
              return listItem;
            });
          }
          //console.log("vv----",vv);
          resolve(vv);
        }).catch(error => {
          reject(error);
        });
      });
    },
    changeFun(v) {
      this.initValueState = false;
      this.triggerChange(v);
    },
    triggerChange(changedValue) {
      this.updateVal = new Date().getTime();
      this.$emit("change", changedValue);
      this.$emit("input", changedValue);
    },
    /* 传递选择结果给父组件 */
    getaddrId(val) {
      let _val = val
      if(!this.dataIsArray) {
        _val = val[val.length - 1];
      }
      this.triggerChange(_val);
    },
    changeInput(value) {
      let vv = value;
      let _value = null
      if(this.multiple) {
        _value = vv.map(item=>{
          return item[item.length-1]
        })
      } else if (this.isAllValue) {
        _value = vv.map(item => {
          this.getTreeItem(this.list, item);
          //console.log(findTreeResult, "---obj");
          return {
            label: (findTreeResult && findTreeResult.label) || "",
            value: item
          }
        });
      }
      this.triggerChange(_value);
    },
    //获取子级数据
    async getOptionsDataFun(targetOption, resolve) {
      //isDefault:是否是系统默认品目 1 是 0 否
      let param = {
        pageSize: 2000,
        isDefault: 1
      };
      if (this.cancelDefaultParams) {
        param = {};
      }
      if (targetOption) {
        param.parentId = targetOption.value;
      }
      else {
        let actionParamsData = this.actionParams;
        if (actionParamsData && (typeof actionParamsData == "string")) {
          actionParamsData = JSON.parse(actionParamsData);
        }
        //根目录
        param.parentId = (actionParamsData && actionParamsData.rootParentId) || 0;
      }
      let actionParamsData = this.actionParams;
      if (actionParamsData && (typeof actionParamsData == "string")) {
        actionParamsData = JSON.parse(actionParamsData);
      }
      if (actionParamsData) {
        param = {
          ...param,
          ...actionParamsData
        };
      }
      const vv = await this._getOptionsData(param);
      //console.log(vv, "hi vv");
      resolve(vv);
    }
  }
};

</script>
<style lang="less">
.ty-cascader {
  display: inline-block;
  position: relative;

  &.hasValue {
    input::-webkit-input-placeholder {
      color: #717171 !important;
    }
    
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #717171 !important;
    }
    
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #717171 !important;
    }
    
    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #717171 !important;
    }
  }
}

</style>
