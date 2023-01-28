<template>
  <el-form
    class="pc-form"
    ref="generateForm"
    :validate-on-rule-change="false"
    :disabled="disabled"
    :label-suffix="labelSuffix"
    :size="data.config.size"
    :model="models"
    :rules="rules"
    :label-position="data.config.labelPosition"
    :label-width="data.config.labelWidth + 'px'"
    @validate="$emit('validate', $event)"
     @submit.native.prevent
  >
    <slot name="form-content-before" />
    <template v-for="item in data.list">
      <template v-if="item.type == 'card'">
        <div :key="item.key">
          <el-card
            :body-style="{ padding:`${(item.options.bodyPadding||20)}px`}"
            :shadow="item.options.shadow"
          >
            <div
              slot="header"
              v-if="item.options.showHead"
            >
              <span>{{item.name}}</span>
            </div>
            <template v-for="(el) in item.list">
              <pc-form-item
                :key="el.key"
                :models.sync="models"
                :rules="rules"
                :widget="el"
                @input-change="onInputChange"
              >
                <div
                  :slot="el.options.slotName"
                  slot-scope="{data}"
                >
                  <slot
                    :name="el.options.slotName"
                    :data="data"
                  ></slot>
                </div>
              </pc-form-item>
            </template>
          </el-card>
        </div>
      </template>
      <template v-else-if="item.type == 'tabs'">
        <div :key="item.key">
          <el-form-item
            :label="item.name"
            :label-width="getItemLabelWidth(item.name)"
          >
            <el-tabs
              v-model="item.options.activeTab"
              :key="item.key"
              :type="item.options.type"
              :tab-position="item.options.align"
            >
              <el-tab-pane
                :label="tab.label"
                :name="tab.name"
                v-for="(tab,index) in item.tabs"
                :key="index"
              >
                <template v-for="(el) in tab.list">
                  <pc-form-item
                    :key="el.key"
                    :models.sync="models"
                    :rules="rules"
                    :widget="el"
                    @input-change="onInputChange"
                  >
                    <div
                      :slot="el.options.slotName"
                      slot-scope="{data}"
                    >
                      <slot
                        :name="el.options.slotName"
                        :data="data"
                      ></slot>
                    </div>
                  </pc-form-item>
                </template>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </div>
      </template>
      <template v-else-if="item.type == 'grid'">
        <el-row
          :key="item.key"
          type="flex"
          :gutter="item.options.gutter ? item.options.gutter : 0"
          :justify="item.options.justify"
          :align="item.options.align"
        >
          <el-col
            v-for="(col, colIndex) in item.columns"
            :key="colIndex"
            :span="col.span"
          >
            <template v-for="citem in col.list">
              <div v-if="citem && citem.key" :key="citem.key">
                <custom-attr-item 
                  v-if="citem.type === 'customAttr'"
                  :item="citem"
                  :models.sync="models"
                  :rules="rules"
                  @input-change="onInputChange"
                  v-bind="$attrs">
                </custom-attr-item>
                <pc-form-item
                  v-else
                  :models.sync="models"
                  :rules="rules"
                  :widget="citem"
                  @input-change="onInputChange"
                  v-bind="$attrs"
                >
                  <template
                    :slot="citem.options.slotName"
                    slot-scope="{data}"
                  >
                    <slot
                      :name="citem.options.slotName"
                      :data="data"
                    >
                  </slot>
                  </template>
                </pc-form-item>
              </div>
            </template>
          </el-col>
        </el-row>
        <!-- <grid-item :item="item" :models.sync="models" :rules="rules" @input-change="onInputChange"></grid-item> -->
      </template>
      <template v-else-if="item.type === 'binding'">
        <binding-item :item="item" :models.sync="models" :rules="rules" @input-change="onInputChange"></binding-item>
      </template>
      <template v-else-if="item.type === 'customAttr'">
        <custom-attr-item :item="item" :models.sync="models" :rules="rules" @input-change="onInputChange"></custom-attr-item>
      </template>
      <template v-else-if="item.type === 'hide'">
      </template>
      <template v-else>
        <pc-form-item
          :key="item.key"
          :models.sync="models"
          :rules="rules"
          :widget="item"
          @input-change="onInputChange"
        >
          <div
            :slot="item.options.slotName"
            slot-scope="{data}"
          >
            <slot
              :name="item.options.slotName"
              :data="data"
            >
              <div
                style="background:#f1f1f1;height:50px;line-height:50px;font-size:14px;text-align:center;margin:5px 0;"
              >
                {{item.name}}
              </div>
            </slot>
          </div>
        </pc-form-item>
      </template>
    </template>
    <slot name="form-content"></slot>
  </el-form>
</template>
<script>
/**
 * 组件名称 PcForm
 * @module components/fmDesign/PcForm
 * @desc 表单设计器-解析器pc
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Object} [data] -表单格式json数据
 * @param {Object} [value] - 表单的值key-value结构数据
 * @example 调用示例
 *    <pc-form :data="jsonData"  :value="editData" ref="generateForm"> 
      </pc-form>
 **/
import PcFormItem from "./PcFormItem";
import gridItem from "./components/gridItem.vue";
import bindingItem from "./components/bindingItem.vue";
import customAttrItem from "./components/customAttrItem.vue"
import {
  checkIdCard
}
from "utils/common";
export default {
  name: "PcForm",
  components: {
    PcFormItem,
    gridItem,
    bindingItem,
    customAttrItem
  },
  props: {
    // 表单域标签的后缀
    labelSuffix: {
      type: String,
      default: ':'
    },
    //每行显示多少个字段值
    rowNum: {
      type: Number,
      default: 1
    },
    //表单格式json数据
    data: {
      type: Object,
      default: () => {}
    },
    //表单的值key-value结构数据
    value: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      models: {},
      rules: {}
    };
  },
  created() {
    this.generateModle(this.data.list);
  },
  mounted() {},
  methods: {
    designFormValidatorPhone(rule, value, callback) {
      if (!value) {
        callback(new Error("请填写电话号码"));
      }
      else {
        if (!(/^1[3|5|6|8]\d{9}$/.test(value) || /^0\d{2,3}-?\d{7,8}$/.test(value))) {
          callback(new Error("电话格式不正确"));
        }
        else {
          callback();
        }
      }
    },
    designFormValidatorIdCard(rule, value, callback) {
      if (!value) {
        callback(new Error("请填写身份证号码"));
      }
      else {
        if (!checkIdCard(value)) {
          callback(new Error("身份证号码格式不正确"));
        }
        else {
          callback();
        }
      }
    },
    getItemLabelWidth(name) {
      return name ? "" : "0px";
    },
    //解析值
    generateModle(genList) {
      let models = {}
      for (let i = 0; i < genList.length; i++) {
        if(genList[i].type === "binding") {
          let genItem = genList[i];
          for(let j = 0;j<genItem.list.length;j++) {
            if(genItem.list[j].type === 'grid') {
              genItem.list[j].columns.forEach(item => {
                this.generateModle(item.list);
              });
            } else {
              this.generateModle(genItem.list);
              continue
            }
          }
        } else  if (genList[i].type === "grid") {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list);
          });
        }
        else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            models[genList[i].model] = this.value[genList[i].model];
          }
          else {
            models[genList[i].model] = genList[i].options.defaultValue;
          }
          let ruleArr = [];
          if (!this.disabled) { //编辑状态才显示验证
            ruleArr = [...(genList[i].rules || []).map(item => {
              if (item.validator) {
                let fun = this.$parent[item.validator];
                if (item.validator == 'designFormValidatorPhone') {
                  fun = this.designFormValidatorPhone;
                }
                if (item.validator == 'designFormValidatorIdCard') {
                  fun = this.designFormValidatorIdCard;
                }
                if (fun) {
                  item.validator = fun;
                }
              }
              if (item.pattern) {
                return {
                  ...item,
                  pattern: eval(item.pattern)
                };
              }
              else {
                return {
                  ...item
                };
              }
            })];
          }
          this.$set(this.rules, [genList[i].model], ruleArr);
        }
        this.models = Object.assign(models,this.models);
      }
    },
    //获取表单的值
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models);
          }
          else {
            reject(new Error("表单数据校验失败"));
          }
        });
      });
    },
    //对部分字段验证
    validateField(filedName) {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validateField(filedName, error => {
          if (!error) {
            resolve("验证通过");
          }
          else {
            reject(error);
          }
        });
      });
    },
    //重置表单值
    reset() {
      this.$refs.generateForm.resetFields();
    },
    //输入框改变时触发值
    onInputChange(value, field) {
      const newVal = Object.assign({}, this.value, {
        [field]: value
      });
      this.$emit("input", newVal);
      this.$emit("onChange", field, value, this.models);
    },
    refresh() {}
  },
  watch: {
    models:{
      deep:true,
      handler(val) {
        // console.log(val,'models');
      }
    },
    data: {
      deep: true,
      handler(val) {
        this.generateModle(val.list);
      }
    },
    value: {
      deep: true,
      handler(val) {
        this.models = {
          ...this.models,
          ...val
        };
      }
    }
  }
};
</script>
