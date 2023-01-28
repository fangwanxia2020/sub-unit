<template>
  <div>
    <div class="fmBox">
      <pc-form
        :data="jsonData"
        v-model="editData"
        ref="generateForm"
        :disabled="false"
      >
        <template v-slot:slotName>
          <el-input></el-input>
        </template>
        <template v-slot:slotlong>
          <el-input></el-input>
        </template>
        <template v-slot:slotAAA>
          <el-input></el-input>
        </template>
      </pc-form>
      <div class="fmBox-btn">
        <el-button
          type="primary"
          @click="handleSubmit"
          size="medium"
        >提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      jsonData: {},
      editData: {
        aa: Number(1)
      },
    }
  },
  watch: {
    "editData.radio_1604641988000"(value) {
      this.jsonData = this.getJson(value);
    }
  },
  created() {
    this.jsonData = this.getJson(1);
  },
  methods: {
    getJson(value) {
      const v = value || "";
      let rule = [{
        "type": "string",
        "message": "请输入字符串类型数据"
      }, {
        "required": false,
        "message": "单行文本不能为空"
      }];
      if (v == 1) {
        rule = [{
          "type": "string",
          "message": "请输入字符串类型数据"
        }, {
          "required": true,
          "message": "单行文本" + v + "不能为空"
        }]
      }
      return {
        "list": [{
          "type": "radio",
          "icon": "icon-radio-active",
          "name": "单选框",
          "options": {
            "inline": false,
            "defaultValue": "选项2",
            "showLabel": true,
            "options": [{
              "value": "1",
              "label": "选项1"
            }, {
              "value": "2",
              "label": "选项2"
            }, {
              "value": "3",
              "label": "选项3"
            }],
            "required": false,
            "width": "",
            "optionDataType": 1,
            "interfaceMethod": "",
            "interfaceParam": "",
            "interfaceId": "",
            "dictKey": "",
            "props": {
              "value": "value",
              "label": "label"
            },
            "disabled": false,
            "tipFont": ""
          },
          "key": 1604641988000,
          "model": "radio_1604641988000",
          "rules": []
        }, {
          "type": "cascader",
          "icon": "icon-jilianxuanze",
          "name": "级联选择器",
          "flag": 0,
          "options": {
            "clearable": false,
            "borderRadius": "no",
            "defaultValue": [],
            "width": "",
            "placeholder": "",
            "disabled": false,
            "required": false,
            "showLabel": true,
            "options": [{
              "value": 1,
              "label": "选项1",
              "children": [{
                "value": 11,
                "label": "选项1-1"
              }]
            }, {
              "value": 2,
              "label": "选项2",
              "children": [{
                "value": 21,
                "label": "选项2-1"
              }]
            }],
            "optionDataType": 3,
            "interfaceMethod": "/system/SysGoodsItems/getGoodsItemLists",
            "interfaceParam": "",
            "interfaceId": 1663673383000,
            "resList": "data.records",
            "interfaceType": "get",
            "tipFont": "",
            "dictKey": "",
            "props": {
              "value": "id",
              "label": "itemName",
              "children": "children"
            }
          },
          "key": 1663673380000,
          "model": "cascader_1663673380000",
          "prop": {
            "relation": [{
              "templateServiceInterfaceId": null,
              "attrKey": null
            }]
          },
          "rules": []
        },{
          "type": "input",
          "icon": "icon-input",
          "name": "单行文本" + v,
          "options": {
            "showText": false,
            "width": "100%",
            "defaultValue": "",
            "required": false,
            "dataType": "string",
            "maxlength": "",
            "minlength": "",
            "pattern": "",
            "patternTips": "",
            "placeholder": "",
            "disabled": false,
            "hide": false,
            "tipFont": "",
            "mouseTips": ""
          },
          "key": 1604641990000,
          "model": "aa",
          "rules": rule
        },{
          "type": "slot",
          "icon": "icon-wenzishezhi-",
          "name": "自定义插槽",
          "flag": 1,
          "options": {
            "width": "100%",
            "slotName": "slotName",
            "defaultValue": "",
            "required": false,
            "validator": "",
            "hideLabel": false
          },
          "key": 1662543303000,
          "model": "slot_1662543303000",
          "rules": []
        }, {
          "type": "editor",
          "icon": "icon-fuwenbenkuang",
          "name": "编辑器",
          "flag": 1,
          "options": {
            "defaultValue": "",
            "width": "",
            "action": "common/uploadOss",
            "actionParams": "",
            "maxSize": 5,
            "resFormat": ""
          },
          "key": 1662543306000,
          "model": "editor_1662543306000",
          "rules": []
        },{
          "type": "grid",
          "icon": "icon-grid-",
          "name": "栅格布局",
          "columns": [{
            "span": 12,
            "list": [{
              "type": "slot",
              "icon": "icon-wenzishezhi-",
              "name": "喜喜",
              "flag": 1,
              "options": {
                "width": "100%",
                "slotName": "slotlong",
                "defaultValue": "",
                "required": false,
                "validator": "",
                "hideLabel": false
              },
              "key": "1662615752000_8538",
              "model": "slot_1662615752000_8538",
              "rules": []
            }]
          }, {
            "span": 12,
            "list": [{
              "type": "input",
              "icon": "icon-input",
              "name": "单行文本" + v,
              "options": {
                "showText": false,
                "width": "100%",
                "defaultValue": "",
                "required": false,
                "dataType": "string",
                "maxlength": "",
                "minlength": "",
                "pattern": "",
                "patternTips": "",
                "placeholder": "",
                "disabled": false,
                "hide": false,
                "tipFont": "",
                "mouseTips": ""
              },
              "key": 1604641990000,
              "model": "aa",
              "rules": rule
            },]
          }],
          "options": {
            "gutter": 0,
            "justify": "start",
            "align": "top"
          },
          "key": 1662615749000,
          "model": "grid_1662615749000",
          "rules": []
        }],
        "config": {
          "id": "form_1604641985000",
          "labelWidth": 100,
          "labelPosition": "right",
          "size": "medium",
          "formName": "pc端表单"
        }
      }
    },
    handleSubmit() {
      this.$refs.generateForm.getData().then(data => {
        // success
        alert("表单的值" + JSON.stringify(data));
      }).catch(e => {
        // error
      })
    }
  }
}

</script>
<style scoped>
.fmBox {
  overflow: hidden;
  padding: 20px;
  border: 1px solid #ddd;
  margin: 20px;
}

.fmBox-btn {
  padding-top: 10px;
  text-align: center;
}

</style>
