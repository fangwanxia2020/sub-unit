<template>
  <div class="ty-edit-table">
    <el-form
      :validate-on-rule-change="false"
      :disabled="disabled"
      ref="editTableForm"
      :model="formData"
      :rules="rules"
    >
      <el-table
        :size="size"
        ref="TyEditTableObj"
        :row-key="id"
        :data="formData.tableList"
        :max-height="maxHeight"
        border
        :stripe="stripe"
        tooltip-effect="light"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          v-if="showSelect"
          :selectable="checkboxInit"
        ></el-table-column>
        <el-table-column
          type="index"
          width="50"
          label="序号"
          v-if="showIndex"
        ></el-table-column>
        <template v-for="(item, index) in columns">
          <el-table-column
            v-if="item.show != false"
            :key="index"
            :fixed="item.fixed"
            :prop="item.prop"
            :label="item.label"
            :align="item.align ? item.align : 'center'"
            :width="item.width"
            :show-overflow-tooltip="item.showOverflowTooltip"
          >
            <template slot="header">
              <div :class="{ required: getIsRequired(item.prop) }">
                <template v-if="!item.labelSlot">{{ item.label }}</template>
                <template v-else>
                  <slot :name="`label-${item.prop}`">{{
                    item.label || "标题"
                  }}</slot>
                </template>
              </div>
            </template>
            <template slot-scope="scope">
              <div v-if="item.type == 'slot'">
                <el-form-item
                  label=""
                  label-width="0px"
                  :key="scope.column.property + index"
                  :prop="
                    'tableList.' + scope.$index + `.${[scope.column.property]}`
                  "
                  :rules="getFormItemRule(scope.row, scope.column.property)"
                >
                  <slot
                    :name="item.prop"
                    :data="scope.row"
                    :index="scope.$index"
                  ></slot>
                </el-form-item>
              </div>
              <div v-else-if="item.type == 'operation'">
                <slot name="operation" v-bind:row="scope.row">
                  <slot name="rowOperator" v-bind:row="scope.row"></slot>
                  <el-button
                    @click="upMove(scope.$index, scope.row)"
                    v-if="
                      scope.$index != 0 &&
                      formData.tableList.length > 1 &&
                      showMove
                    "
                    size="small"
                    type="text"
                    >上移</el-button
                  >
                  <el-button
                    @click="downMove(scope.$index, scope.row)"
                    v-if="
                      scope.$index != formData.tableList.length - 1 &&
                      formData.tableList.length > 1 &&
                      showMove
                    "
                    size="small"
                    type="text"
                    >下移</el-button
                  >
                  <el-button
                    v-if="showDelete"
                    @click="handleDelete(scope.row, scope.$index)"
                    size="small"
                    type="text"
                    style="color: red"
                    >删除</el-button
                  >
                </slot>
              </div>
              <div v-else-if="item.type == 'text'">
                {{ scope.row[scope.column.property] || "-" }}
              </div>
              <div v-else>
                <el-form-item
                  label=""
                  label-width="0px"
                  :key="scope.column.property + scope.$index"
                  :prop="
                    'tableList.' + scope.$index + `.${[scope.column.property]}`
                  "
                  :rules="getFormItemRule(scope.row, scope.column.property)"
                >
                  <render-item
                    :key="scope.column.property + scope.$index + '_item'"
                    :widget="creatFormatFormFun(item, scope.row)"
                    :value.sync="scope.row[scope.column.property]"
                  ></render-item>
                </el-form-item>
                <!-- <render-item
                  :widget="creatFormatFormFun(item)"
                  :value.sync="scope.row[scope.column.property]"
                ></render-item> -->
                <!-- @change="getNew(scope)" -->
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-form>
  </div>
</template>
<script>
import { checkIdCard } from "utils/common";
import RenderItem from "components/PcForm/src/RenderItem";
import componentsConfig from "components/FmDesign/src/json/componentsConfig";
export default {
  name: "TyEditTable",
  components: {
    RenderItem,
  },
  props: {
    //最多允许添加的行数
    maxlength: {
      type: [String, Number],
      default: "", //无限添加
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //是否显示上移下移
    showMove: {
      type: Boolean,
      default: true,
    },
    //是否显示删除
    showDelete: {
      type: Boolean,
      default: true,
    },
    //Table 的尺寸medium / small / mini
    size: {
      type: String,
      default: "medium",
    },
    //判断唯一性的值
    id: {
      type: String,
      default: "id",
    },
    //checkbox选中列表
    checkList: {
      type: Array,
      default: () => [],
    },
    //表头
    columns: Array,
    //数据
    data: Array,
    //最大高度
    maxHeight: {
      type: Number,
    },
    //是否显示斑马线
    stripe: {
      type: Boolean,
      default: true,
    },
    //显示复选框
    showSelect: {
      type: Boolean,
      default: false,
    },
    //显示序号
    showIndex: {
      type: Boolean,
      default: false,
    },
    //控制可以勾选复选框,方法需要返回true,或者false
    checkboxControl: {
      type: Function,
    },
    //控制每个元素是否可以编辑
    disabledControl: {
      type: Function,
    },
  },
  data() {
    return {
      formData: {
        tableList: [],
      },
      rules: {}, //校验规则
      //  {
      //   "tableList.0.name": [{
      //     "type": "string",
      //     "message": "请输入字符串类型数据"
      //   }, {
      //     "required": true,
      //     "message": "单行文本不能为空"
      //   }]
      // }
      deleteArr: [], //删除的数据
      allPageSelection: this.checkList || [], //checkbox选中的行包含分页选中的
      multipleSelection: [], //当前checkbox选中的行
      currentRow: null,
      canAdd: true,
    };
  },
  watch: {
    data: {
      handler(val) {
        this.formData.tableList = val;
      },
      deep: true,
    },
    newData: {
      handler(val, oldVal) {
        console.log(val, oldVal, "val, oldVal");

        if ((val && val.length) == (oldVal && oldVal.length)) {
          const lastLine_val =
            (val && val.length > 0 && val[val.length - 1]) || {};
          const lastLine_oldVal =
            (oldVal && oldVal.length > 0 && oldVal[oldVal.length - 1]) || {};
          console.log("jjjj", lastLine_val, lastLine_oldVal);
          // alert(this.isObjectChanged(lastLine_val, lastLine_oldVal));
          // console.log(lastLine_val.hasOwnProperty(this.id))
          if (this.isObjectChanged(lastLine_val, lastLine_oldVal) && this.canAdd) {
            this.getNewFun();
          }
          // 再把可以新增开关打开
          this.canAdd = true
        }
      },
      deep: true,
    },
    checkList(rows) {},
    allPageSelection(val) {
      this.handleAllSelectionChange(val);
    },
    "formData.tableList": {
      handler(val, oldVal) {
        this.allPageSelection = this.checkList || [];
        this.multipleSelection = null;
        setTimeout(() => {
          this.changeRowSelection(this.allPageSelection, this.id);
        }, 100);
      },
      deep: true,
    },
    multipleSelection: {
      handler(val, oldval) {
        //console.log(val, oldval, "00000jjj");
        if (this.multipleSelection == null) return; //避免切换分页的时候重置值
        if (!val) val = [];
        if (!oldval) oldval = [];
        const selList = val.concat(this.allPageSelection); //复制一个备份并且
        if (oldval.length > val.length) {
          //删除
          const delItem = oldval.filter((item) => {
            const isDel = val.findIndex((o) => o[this.id] == item[this.id]) < 0;
            const inPage =
              this.formData.tableList.findIndex(
                (o) => o[this.id] == item[this.id]
              ) >= 0;
            return isDel && inPage;
          });
          if (delItem.length > 0) {
            delItem.forEach((obj) => {
              const delIndex = selList.findIndex(
                (item) => item[this.id] == obj[this.id]
              );
              if (delIndex >= 0) {
                selList.splice(delIndex, 1);
              }
            });
          }
        } else {
          //添加
          const addItem = val.filter((item) => !oldval.includes(item));
          if (addItem.length > 0) {
            addItem.forEach((obj) => {
              selList.push(obj);
            });
          }
        }
        this.allPageSelection = this.unique(selList); //去重
      },
      deep: true,
    },
  },
  computed: {
    newData() {
      return JSON.parse(JSON.stringify(this.formData.tableList || []));
    },
  },
  mounted() {
    this.formData.tableList = this.data;
    this.generateModle(this.columns);
  },
  methods: {
    //获取表单项的验证规则
    getFormItemRule(row, prop) {
      const index = this.formData.tableList.findIndex(
        (obj) => obj[this.id] == row[this.id]
      );
      if (
        index == this.formData.tableList.length - 1 &&
        Object.keys(row).length == 1
      ) {
        //是否最后一行并且是什么数据都没有输入过
        return {};
      }
      return this.rules[prop];
    },
    //获取表单的值
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.editTableForm.validate((valid) => {
          if (valid) {
            resolve(this.formData.tableList);
          } else {
            reject(new Error("表单数据校验失败"));
          }
        });
      });
    },
    //是否为必填字段
    getIsRequired(prop) {
      const rule = this.rules[prop];
      if (!rule) return false;
      let result = false;
      for (let i in rule) {
        if (rule[i].required) {
          result = true;
          break;
        }
      }
      return result;
    },
    //验证电话
    designFormValidatorPhone(rule, value, callback) {
      if (!value) {
        callback(new Error("请填写电话号码"));
      } else {
        if (
          !(/^1[3|5|6|8]\d{9}$/.test(value) || /^0\d{2,3}-?\d{7,8}$/.test(value))
        ) {
          callback(new Error("电话格式不正确"));
        } else {
          callback();
        }
      }
    },
    //验证身份证
    designFormValidatorIdCard(rule, value, callback) {
      if (!value) {
        callback(new Error("请填写身份证号码"));
      } else {
        if (!checkIdCard(value)) {
          callback(new Error("身份证号码格式不正确"));
        } else {
          callback();
        }
      }
    },
    //设置规则
    generateModle(columns) {
      const aa = columns.filter(
        (item) => item.formFormat && item.formFormat.rules
      );
      const genList = aa.map((item) => {
        return this.creatFormatFormFun(item);
      });
      for (let i = 0; i < genList.length; i++) {
        let ruleArr = [];
        ruleArr = [
          ...(genList[i].rules || []).map((item) => {
            if (item.validator) {
              let fun = this.$parent[item.validator];
              if (item.validator == "designFormValidatorPhone") {
                fun = this.designFormValidatorPhone;
              }
              if (item.validator == "designFormValidatorIdCard") {
                fun = this.designFormValidatorIdCard;
              }
              if (fun) {
                item.validator = fun;
              }
            }
            if (item.pattern) {
              return {
                ...item,
                pattern: eval(item.pattern),
              };
            } else {
              return {
                ...item,
              };
            }
          }),
        ];
        this.$set(this.rules, [genList[i].model], ruleArr);
      }
    },
    // 判断数据类型
    getDataType(data) {
      const temp = Object.prototype.toString.call(data);
      const type = temp.match(/\b\w+\b/g);
      return type.length < 2 ? "Undefined" : type[1];
    },
    //判断对象是否相等
    isObjectChanged(source, comparison) {
      source = source || {};
      comparison = comparison || {};
      let isChanged = false;
      for (let key in source) {
        console.log("什么玩意", source[key]);
        // 由于Object和Array都属于我们要特殊判断的数据类型，所以要提前做一下判断
        if (
          this.getDataType(source[key]) === "Object" ||
          this.getDataType(source[key]) === "Array"
        ) {
          // 由于isChanged默认值就是false,所以我们只在isObjectChanged返回true的时候改变状态
          if (this.isObjectChanged(source[key], comparison[key])) {
            isChanged = true;
          }
        } else if (source[key] !== comparison[key]) {
          isChanged = true;
        }
      }
      return isChanged;
    },
    //获取删除的id列表(不包含新增的)
    getDeleteList() {
      return this.deleteArr;
    },
    //删除行
    handleDelete(row, index) {
      if (this.formData.tableList.length == 1) {
        return this.$message.warning("列表数据只有一个了！");
      }
      this.$confirm("确认删除该数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formData.tableList.splice(index, 1);
          const sid = row[this.id];
          //判断不是新增的一些数据就添加到删除记录数组中
          if (sid.toString().indexOf("new_") < 0) {
            this.deleteArr.push(row[this.id]);
          }
          this.$emit("delRow", row);
        })
        .catch(function () {});
    },
    //新增一行
    getNew(scope) {
      const index = this.formData.tableList.findIndex(
        (obj) => obj[this.id] == scope.row[this.id]
      );
      if (index == this.formData.tableList.length - 1) {
        //是否最后一行
        this.formData.tableList.push({
          [this.id]: "new_" + new Date().getTime(),
        });
      }
    },
    //新增一行---新加的处理插槽不自动新增的问题
    getNewFun() {
      if (this.maxlength && this.formData.tableList.length >= this.maxlength) {
        return;
      }
      this.formData.tableList.push({
        [this.id]: "new_" + new Date().getTime(),
      });
    },
    // 交换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      this.formData.tableList = arr;
    },
    // 上移
    upMove(index, data) {
      if(index == this.formData.tableList.length - 1) {
        this.canAdd = false
      }
      this.swapArray(this.formData.tableList, index, index - 1);
    },
    // 下移
    downMove(index, data) {
      this.swapArray(this.formData.tableList, index, index + 1);
    },
    //格式化表单
    creatFormatFormFun(obj, row) {
      const { label, prop, formFormat = {} } = obj;
      const formatType = (formFormat && formFormat.type) || "input";
      const configCom = componentsConfig.pc.base;
      const comFormatObj = configCom.find((o) => formatType == o.type);
      const thisObj = {
        ...comFormatObj,
        ...formFormat,
        name: label,
        key: prop,
        model: prop,
        //rules: []
      };
      if (row) {
        const vv = this.getDisabledVal(row, prop);
        Object.assign(thisObj, {
          options: {
            ...thisObj.options,
            disabled: vv,
          },
        });
      }
      return thisObj;
    },
    getDisabledVal(row, prop) {
      //控制是否可以编辑
      const disabledVal = this.itemDisabledFun(row, prop);
      console.log(row, prop, disabledVal);
      return disabledVal;
    },
    //控制复选框是否可以编辑
    checkboxInit(row, index) {
      if (this.checkboxControl) {
        if (this.checkboxControl(row, index)) {
          return 1;
        } else {
          return 0;
        }
      }
      return 1;
    },
    //控制每个元素是否可以编辑
    itemDisabledFun(row, prop) {
      if (this.disabledControl) {
        if (this.disabledControl(row, prop)) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    //数组去重
    unique(arr) {
      //console.info('原始数组：', arr);
      const hash = {};
      const newArray = arr.reduce((item, next) => {
        hash[next[this.id]]
          ? ""
          : (hash[next[this.id]] = true && item.push(next));
        return item;
      }, []);
      //console.info('去重后的数组:', newArray);
      return newArray;
    },
    //选中复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selectionChange", val);
    },
    //选中复选框包含分页的选中值
    handleAllSelectionChange(val) {
      let vv = [].concat(val).sort((a, b) => a[this.id] - b[this.id]);
      this.$emit("update:checkList", vv);
      this.$emit("allSelectionChange", vv);
    },
    //ty-edit-table方法,删除已选的Selection数据(一般在已选列表中的删除使用)
    delSelection(item) {
      //删掉此项数据
      if (
        this.formData.tableList.findIndex(
          (obj) => obj[this.id] == item[this.id]
        ) >= 0
      ) {
        //当在此页的数据
        const list = this.allPageSelection.filter(
          (obj) => obj[this.id] != item[this.id]
        );
        this.changeRowSelection(list, this.id);
      } else {
        this.allPageSelection = this.allPageSelection.filter(
          (obj) => obj[this.id] != item[this.id]
        );
      }
    },
    //ty-edit-table方法,选中当前行
    changeRowSelection(rows, tag) {
      //tag是为了解决分页选不上的问题,表示判断两个对象相等的唯一标识
      if (!this.$refs.TyEditTableObj) return;
      this.$refs.TyEditTableObj.clearSelection();
      if (rows && rows.length > 0) {
        if (tag) {
          rows.forEach((row) => {
            const rr = this.formData.tableList.find((i) => i[tag] == row[tag]);
            rr && this.$refs.TyEditTableObj.toggleRowSelection(rr, true);
          });
        } else {
          rows.forEach((row) => {
            row && this.$refs.TyEditTableObj.toggleRowSelection(row, true);
          });
        }
      }
      this.allPageSelection = rows || [];
    },
  },
};
</script>
<style
  scoped
  lang="scss"
>
.ty-edit-table {
  /* 在IE下 table 表格宽度不是100%的问题 */
  ::v-deep .el-table__header {
    width: 100% !important;
  }

  ::v-deep .el-table__body {
    width: 100% !important;
  }

  ::v-deep .el-table th > .cell {
    .required {
      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
}
</style>
