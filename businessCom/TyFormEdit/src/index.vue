<!-- 模板管理--添加修改-->
<template>
  <div class="template-add">
    <fm-design
      :key="formId"
      @save="saveTemplateFun"
      :templateJson="templateJson"
      v-bind="$attrs"
    >
      <div
        slot="formConfig"
        class="form-config"
      >
        <pc-form
          :data="formConfigJson"
          v-model="formConfigData"
          ref="formConfigForm"
          v-if="showformConfig"
        >
          <!-- <ty-dictionary
            slot="applytemplateType_slot"
            :isAllValue="true"
            width=""
            :actionParams="{dictType:'member-type'}"
            :formatData="formatDictData"
            action="http://192.168.1.147:9547/yanxue-association-server/system/dict/data/list"
            v-model="formConfigData.applytemplateType"
          ></ty-dictionary> -->
        </pc-form>
        <slot></slot>
      </div>
    </fm-design>
  </div>
</template>
<script>
import { addTemplate, getTemplateDetail, editTemplate } from "./api";
import FmDesign from "components/FmDesign";
import PcForm from "components/PcForm";
import TyDictionary from "components/TyDictionary";
import formConfig from './formConfig.json';
export default {
  name: "TyFormEdit",
  components: {
    FmDesign,
    PcForm,
    TyDictionary,
  },
  props: {
    //是否显示表单模板属性值表单
    showformConfig: {
      type: Boolean,
      default: true,
    },
    // 新表单设计器的标志
    newFormEditSign:{
      type: Boolean,
      default: false,
    },
    //查询详情接口信息
    getDetailInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/getInfo", //接口地址
          methodType: "get", //接口请求类型
          paramsFormatFun: null,
          resFormatFun: null,
        };
      },
    },
    //保存方法
    saveInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/add", //接口地址
          methodType: "post", //接口请求类型
          dataFormatFun: null, //格式化数据方法
        };
      },
    },
    //修改方法
    updateInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/edit", //接口地址
          methodType: "post", //接口请求类型
          dataFormatFun: null, //格式化数据方法
        };
      },
    },
    templateJsonData:{
      type: Object,
      default:() =>{
        return {
          list: [],
          config: {
            id: "form_1606383079000",
            labelWidth: 100,
            labelPosition: "right",
            size: "medium",
            formName: "模板表单",
          },
        }
      }
    },
    formConfigDataProp:{
      type: Object,
      default:() => {
        return {}
      }
    }
  },
  watch: {
    templateJsonData:{
      handler(newValue) {
        this.templateJson = newValue;
      },
      deep:true
    },
    formConfigDataProp:{
      handler(newValue) {
        this.formConfigData = newValue;
      },
      deep:true
    }
  },
  data() {
    return {
      formId: "",
      templateJson: this.templateJsonData,
      formConfigJson: formConfig,
      formConfigData: this.formConfigDataProp,
    };
  },
  computed: {},
  created() {
    if(!this.newFormEditSign) {
      const { id } = this.$route.query;
      if (id) {
        let params = id;
        const { paramsFormatFun, resFormatFun } = this.getDetailInterface;
        if (paramsFormatFun) {
          params = paramsFormatFun(id);
        }
        getTemplateDetail(params, this.getDetailInterface).then((res) => {
          this.formId = new Date().getTime();
          let callBackData = res.data;
          if (resFormatFun) {
            callBackData = resFormatFun(res);
          }
          const { applytemplateFileds } = callBackData;
          if (applytemplateFileds) {
            this.templateJson = JSON.parse(applytemplateFileds);
          }
          this.formConfigData = callBackData;
        });
      }
    }
  },
  methods: {
    formatDictData(res) {
      const records = res.rows;
      return records.map((item) => {
        const { dictLabel, dictValue } = item;
        return {
          label: dictLabel,
          value: dictValue,
        };
      });
    },
    goList() {
      this.$router.push({
        path: this.$route.path,
      });
    },
    //保存模板
    saveTemplateFun(json) {
      if (this.showformConfig) {
        this.$refs.formConfigForm.getData().then((data) => {
          const { applytemplateName, applytemplateNature, applytemplateType } =
            data;
          const { label, value } = applytemplateType || {};
          let postData = {
            applytemplateFileds: JSON.stringify(json),
            applytemplateName,
            applytemplateNature,
            applytemplateType: value,
            applytemplateTypename: label,
          };
          if(this.newFormEditSign) {
            this.$emit('getTemplateInfo',postData)
            return
          }
          this._saveTemplateFun(postData);
        });
      } else {
        let postData = {
          applytemplateFileds: JSON.stringify(json),
        };
        this._saveTemplateFun(postData);
      }
    },
    //保存模板方法
    _saveTemplateFun(postData) {
      const { id } = this.$route.query;
      let fun = addTemplate;
      let interfaceObj = this.saveInterface;
      if (id) {
        //修改
        fun = editTemplate;
        postData.applytemplateId = id;
        interfaceObj = this.updateInterface;
      }
      const { dataFormatFun } = interfaceObj;
      if (dataFormatFun) {
        postData = dataFormatFun(postData);
      }
      if (!postData) return;
      fun(postData, interfaceObj).then((data) => {
        if (id) {
          this.$emit("update", data);
        } else {
          this.$emit("add", data);
        }
        this.goList();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// .template-add {
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
// }

.form-config {
  padding: 20px 20px 0 0;
}
</style>
