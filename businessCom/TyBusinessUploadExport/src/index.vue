<!--
 * @Author: hjm
 * @Date: 2022-11-29 10:01:52
 * @LastEditors: hjm
 * @LastEditTime: 2022-12-05 10:12:27
 * @Description: file content
-->
<template>
  <div class="upload">
    <div class="upload-con">
      <el-steps :space="200" :active="active" align-center class="upload-step-des">
        <el-step title="上传文件">
        </el-step>
        <el-step title="导入结果"></el-step>
      </el-steps>
      <div class="upload-main" v-if="active == 1">
        <div class="upload-step-con">
          <div class="upload-step" 
            v-for="(item,index) in stepList"
            :key="index">
            <div class="upload-step-title">步骤{{index+1}}：</div>
            <div class="upload-step-text">{{item.text}}</div>
          </div>
        </div>
        <div class="upload-btn">
          <ty-export class="mr20" 
            v-bind="$attrs" 
            v-on="$listeners" 
            exportType="xlsx"
            :action="exportUrl"
            :actionParams="exportParams">
          </ty-export>
          <ty-upload-file 
            :showUploadList="false" 
            v-bind="$attrs" 
            v-on="$listeners" 
            width="100"
            :action="uploadUrl"
            @change="getUploadData"
            >
          </ty-upload-file>
        </div>
      </div>
      <div v-if="active == 2 && result">
        <slot name="uploadResult">
          <div class="upload-result">
            <div class="upload-result-title">
              导入结果
            </div> 
            <div class="upload-result-main">
              {{resultData.res.msg}}
            </div>
          </div>
        </slot>
      </div>
    </div>
    <div class="upload-help" v-if="help">
      <div class="upload-help-title">帮助</div>
      <div class="upload-help-item"
        v-for="(item,index) in helpList"
        :key="index">
        {{item.text}}
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 组件名称 TyBusinessUploadExport
 * @desc 导入、导出集成功能
 * @author hjm
 * @date 2022年11月29日
 **/

export default {
  name: 'TyBusinessUploadExport',
  components: {
    
  },
  props: {
    // 步骤说明
    stepList:{
      type: Array,
      default:() => [{
        text: '下载导入模板，添加导入信息（可跳过此步骤，使用本地的文件)',
      },{
        text: '将填写好的文件进行上传'
      }] 
    },
    // 帮助内容
    helpList: {
      type: Array,
      default:() => [{
        text: '导入信息验证步骤:',
      },{
        text: '1.验证各字段格式是否正确。'
      },{
        text: '2.验证必填字段内容是否填写',
      },{
        text: '3.验证信息是否已存在。'
      }] 
    },
    // 是否显示帮助
    help: {
      type: Boolean,
      default: true
    },
    // 上传路径
    uploadUrl: {
      type: String,
      default: ''
    },
    // 导出路径
    exportUrl: {
      type: String,
      default: ''
    },
    // 导出参数
    exportParams: {
      type: Object,
      default: () => {}
    },
    // 是否需要显示result
    result: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: 1,
      resultData: {}, // 返回数据
    }
  },
  watch: {
    selectedList(val) {
      this.$emit('checkedChange', val)
    },
  },
  computed: {
   
  },
  created() {
  },
  methods: {
    // 上传回调
    getUploadData(e){
      console.log(e)
      if(this.result) this.active = 2;
      this.resultData = e;
    }
  },
}
</script>
<style lang="scss" scoped>
.upload{
  display: flex;
  padding: 10px;
  background: #F0F1F3;
  &-con{
    flex: 1;
    padding: 20px;
    margin-right: 20px;
    background: #fff;
  }
  &-step-des{
    justify-content: center;
  }
  &-step{
    display: flex;
    margin: 10px 0;
    color:#768181;
    line-height: 26px;
  }
  &-step-title{
    width: 60px;
  }
  &-step-text{
    flex: 1;
  }
  &-step-con{
    margin: 30px 40px;
  }
  &-btn{
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  &-help{
    width: 300px;
    padding: 10px;
    background: #fff;
  }
  &-help-title{
    font-weight: bold;
    margin-bottom: 20px;
  }
  &-help-item{
    color: #768181;
    margin-bottom: 16px;
    line-height: 24px;
  }
  &-result{
    padding: 20px;
    display: flex;
  }
  &-result-title{
    width: 80px;
  }
  &-result-main{
    flex: 1;
    min-height: 100px;
    border: 1px solid #d5d7d7;
    padding: 10px;
    line-height: 24px;
    color: #768181;
  }
}
.mr20{
  margin-right: 20px;
}
</style>
