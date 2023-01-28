<template>
  <!--配置弹窗 ylq-->
  <ty-dialog
    :show.sync="congfigDialogVisible"
    :title="congfigDialogName"
    :showFooter="false"
    :onClose="goBack"
    :appendToBody="true"
    :width="`${dialogWidth}px`"
    :destroyOnClose="true"
  >
    <ty-pc-form :backBtnText="backBtnText" :submitBtnText="submitBtnText" :apiData="templateConfigurationId" :requestEditData="requestEditData" :detailData="detailData"  @goBack="goBack" @submitSuccess="submitSuccess" :detailFlag="detailFlag"></ty-pc-form>
  </ty-dialog>
</template>

<script>
import { configurationInfo } from './api'
export default {
  data() {
    return {
      congfigDialogVisible: false,
      congfigDialogName: '',
      templateConfigurationId: '',
      detailData:"",
      detailFlag:false,
      requestEditData:null,
      submitBtnText:"提交",
      backBtnText:"返回"
    }
  },
  props:{
    //自定义弹窗宽度
    dialogWidth:{
      type: String | Number,
      default: '500',
    }
  },
  methods: {
    getConfigurationInfo(obj,formBtnText) {
      const {clickTypeDetail, checkObj,templateTitle,clickType}=obj
      if(formBtnText){
      const {submitText,backBtnText}=formBtnText
      if(submitText)this.submitBtnText=submitText
      if(backBtnText)this.backBtnText=backBtnText
      }
      this.templateConfigurationId = clickTypeDetail
      // this.detailData=checkObj || ""
      //表单类型判断  by ylq  -2022.10.28
      if(clickType&&clickType=="check"){
        this.detailFlag=true
      }
      if(checkObj&&Object.keys(checkObj.length==1)){
        this.detailData=checkObj[Object.keys(checkObj)[0]] || ""
      }else{
        this.detailData=checkObj || ""
      }
      //编辑时提交所需要的id by ylq  -2022.10.28
      this.requestEditData=checkObj || {}
      configurationInfo(clickTypeDetail).then((res) => {
        if (res.code === 200) {
          let data = res.data
          this.congfigDialogName=templateTitle||data.name
          this.congfigDialogVisible = true
        }
      })
    },
    submitSuccess(res){
    //todo
      this.$emit("refresh")
      this.congfigDialogVisible=false
    },
    goBack(){
      this.congfigDialogVisible=false
    }
  },
}
</script>
