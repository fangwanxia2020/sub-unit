<!-- 模板管理--添加修改-->
<template>
  <div class="template-add">
    <fm-design
      :key="formId"
      @save="saveTemplateFun"
      :businessComponent="businessComponent"
      :templateJson="templateJson"
    >
      <div
        slot="formConfig"
        class="form-config"
      >
        <pc-form
          :data="formConfigJson"
          v-model="formConfigData"
          ref="formConfigForm"
          v-if="formManage.showformConfig"
        >
          <ty-dictionary
            slot="applytemplateType_slot"
            :isAllValue="true"
            width=""
            :actionParams="{dictType:'member-type'}"
            :formatData="formatDictData"
            action="http://192.168.1.147:9547/yanxue-association-server/system/dict/data/list"
            v-model="formConfigData.applytemplateType"
          ></ty-dictionary>
        </pc-form>
        <slot></slot>
      </div>
    </fm-design>
  </div>
</template>
<script>
import {
  addTemplate,
  getTemplateDetail,
  editTemplate,
}
from "./api";
import FmDesign from "components/FmDesign";
import PcForm from "components/PcForm";
import TyDictionary from "components/TyDictionary";
export default {
  components: {
    FmDesign,
    PcForm,
    TyDictionary
  },
  inject: ['formManage'],
  data() {
    return {
      formId: "",
      templateJson: {
        "list": [],
        "config": {
          "id": "form_1606383079000",
          "labelWidth": 100,
          "labelPosition": "right",
          "size": "medium",
          "formName": "模板表单"
        }
      },
      businessComponent: {
        pc: this.formManage.businessComponent,
        mobile: []
      },
      formConfigJson: {
        "list": [{
          "type": "input",
          "icon": "icon-input",
          "name": "模板名称",
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
          "key": 1606383082001,
          "model": "applytemplateName",
          "rules": [{
            "required": true,
            "message": "模板名称不能为空"
          }]
        }, {
          "type": "select",
          "icon": "icon-select",
          "name": "模板性质",
          "options": {
            "defaultValue": "",
            "multiple": false,
            "disabled": false,
            "clearable": false,
            "placeholder": "",
            "required": false,
            "showLabel": true,
            "width": "",
            "options": [{
              "value": 0,
              "label": "单位"
            }, {
              "value": 1,
              "label": "个体"
            }],
            "filterable": false,
            "optionDataType": 1,
            "interfaceMethod": "",
            "interfaceParam": "",
            "interfaceId": "",
            "tipFont": "",
            "dictKey": "",
            "props": {
              "value": "value",
              "label": "label"
            }
          },
          "key": 1606387447000,
          "model": "applytemplateNature",
          "rules": [{
            "required": true,
            "message": "模板性质不能为空"
          }]
        }, {
          "type": "slot",
          "icon": "icon-wenzishezhi-",
          "name": "模板类型",
          "options": {
            "width": "100%",
            "slotName": "applytemplateType_slot",
            "defaultValue": "",
            "required": true,
            "validator": "",
            "hideLabel": false
          },
          "key": 1606965141000,
          "model": "applytemplateType",
          "rules": [{
            "required": true,
            "message": "模板类型不能为空"
          }]
        }],
        "config": {
          "id": "form_1606383079000",
          "labelWidth": 100,
          "labelPosition": "right",
          "size": "medium",
          "formName": "pc端表单"
        }
      },
      formConfigData: {},
    };
  },
  computed: {},
  created() {
    const {
      id
    } = this.$route.query;
    if (id) {
      let params = id;
      const {
        paramsFormatFun,
        resFormatFun
      } = this.formManage.getDetailInterface;
      if (paramsFormatFun) {
        params = paramsFormatFun(id);
      }
      getTemplateDetail(params, this.formManage.getDetailInterface).then(res => {
        this.formId = new Date().getTime();
        let callBackData = res.data;
        if (resFormatFun) {
          callBackData = resFormatFun(res);
        }
        const {
          applytemplateFileds
        } = callBackData;
        if (applytemplateFileds) {
          this.templateJson = JSON.parse(applytemplateFileds);
        }
        this.formConfigData = callBackData;
      });
    }
  },
  methods: {
    formatDictData(res) {
      const records = res.rows;
      return records.map(item => {
        const {
          dictLabel,
          dictValue
        } = item;
        return {
          label: dictLabel,
          value: dictValue
        };
      });
    },
    goList() {
      this.$router.push({
        path: this.$route.path
      });
    },
    //保存模板
    saveTemplateFun(json) {
      if (this.formManage.showformConfig) {
        this.$refs.formConfigForm.getData().then(data => {
          const {
            applytemplateName,
            applytemplateNature,
            applytemplateType
          } = data;
          const {
            label,
            value
          } = applytemplateType || {};
          let postData = {
            applytemplateFileds: JSON.stringify(json),
            applytemplateName,
            applytemplateNature,
            applytemplateType: value,
            applytemplateTypename: label
          };
          this._saveTemplateFun(postData);
        })
      }
      else {
        let postData = {
          applytemplateFileds: JSON.stringify(json)
        };
        this._saveTemplateFun(postData);
      }
    },
    //保存模板方法
    _saveTemplateFun(postData) {
      const {
        id
      } = this.$route.query;
      let fun = addTemplate;
      let interfaceObj = this.formManage.saveInterface;
      if (id) { //修改
        fun = editTemplate;
        postData.applytemplateId = id;
        interfaceObj = this.formManage.updateInterface;
      }
      const {
        dataFormatFun
      } = interfaceObj;
      if (dataFormatFun) {
        postData = dataFormatFun(postData);
      }
      if (!postData) return;
      fun(postData, interfaceObj).then(data => {
        if (id) {
          this.$emit("update", data);
        }
        else {
          this.$emit("add", data);
        }
        this.goList();
      });
    }
  },
};

</script>
<style
  lang='scss'
  scoped
>
.template-add {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.form-config {
  padding: 20px 20px 0 0;
}

</style>
