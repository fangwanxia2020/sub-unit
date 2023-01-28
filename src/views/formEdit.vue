<template>
  <div>
    <ty-form-edit :newFormEditSign="true" @getTemplateInfo="getTemplateInfo" :interfaceJsonData="attrVoList" :templateJsonData="templateJsonData" :formConfigDataProp="formConfigDataProp"></ty-form-edit>
  </div>
</template>

<script>
import { getTemplateDetail, editTemplateConfiguration } from '../../businessCom/TyFormEdit/src/api'
export default {
  data() {
    return {
      attrVoList:[],
      templateJsonData:{
        list:[],
        config: {
          id: "form_1606383079000",
          labelWidth: 100,
          labelPosition: "right",
          size: "medium",
          formName: "模板表单",
        },
      },
      formConfigDataProp:{},
      templateConfigurationId:221
    }
  },
  created() {
    this.getTemplateDetailFun();
  },
  methods:{
    getTemplateInfo(data) {
      let { applytemplateFileds:templateJson, applytemplateName:name } = data;
      let obj = {
        templateJson,
        name,
        templateConfigurationId:this.templateConfigurationId,
        type:1
      }
      this.editTemplateConfigurationFun(obj);
    },
    editTemplateConfigurationFun(obj) {
      editTemplateConfiguration(obj).then(res=>{
        // if(res.code === 200) {
        //   this.$router.go(-1);
        // } 
      })
    },
    getTemplateDetailFun() {
      getTemplateDetail(this.templateConfigurationId,{
        url:'/basic/configuration',
        methodType:'get'
      }).then(res=>{
        if(res.code === 200) {
          let data = res.data;
          this.attrVoList = JSON.parse(JSON.stringify(data.interfaceInfoVoList))
          this.templateJsonData = data.templateJson? JSON.parse(data.templateJson) : this.templateJsonData;
          this.$set(this.formConfigDataProp,'applytemplateName',data.name)
          // this.formConfigDataProp.applytemplateName = data.name;
        }
      })
    }
  }
}
</script>