<template>
  <div>
    <div>
      <div class="formItem-head">
        <div class="head-content">
          <div class="head-content-title">单位类型</div>
        </div>
      </div>
      <el-radio-group v-model="enterpriseTypeTemplateId">
        <el-radio
          @change="changeTemplate($event, item)"
          :label="item.enterpriseTypeTemplateId"
          v-for="item in templateList"
          :key="item.enterpriseTypeTemplateId"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </div>
    <ty-pc-form :apiData="templateId" :requestCreateData="requestCreateData" @submitSuccess="submitSuccess" submitBtnText="下一步" :backBtnShow="false"></ty-pc-form>
  </div>
</template>

<script>
  import { enterpriseTypeTemplateList, getTemplateInfo } from './api/interactionForm'
  const templateIdList = []; //保存类型正确的模板id
  export default {
    data() {
      return {
        enterpriseTypeTemplateId: '',
        templateList: [
          {
            name:'事业单位',
            enterpriseTypeTemplateId:20,
            templateIds:[54,96,97]
          },
          {
            name:'学校',
            enterpriseTypeTemplateId:21,
            templateIds:[63,104,105]
          },
          {
            name:'党政机关',
            enterpriseTypeTemplateId:22,
            templateIds:[106, 107, 110]
          },
          {
            name:'企业',
            enterpriseTypeTemplateId:23,
            templateIds:[16,96,97]
          },
          {
            name:'栏目',
            enterpriseTypeTemplateId:24,
            templateIds:[185]
          },
          {
            name:'货架',
            enterpriseTypeTemplateId:25,
            templateIds:[176]
          },
          {
            name:'商品',
            enterpriseTypeTemplateId:26,
            templateIds:[200,221]
          }
        ],
        templateId: '',
        requestCreateData:{},
        templateType:2,
      }
    },
    created() {
      // this.init()
      // this.getTemplateList()
    },
    methods: {
      getTemplateList() {
        enterpriseTypeTemplateList({
          type: 3
        }).then((res) => {
          if (res.code === 200) {
            this.templateList = res.data.records
          }
        })
      },
      async changeTemplate(event, item) {
        if(item.templateIds && item.templateIds.length > 0) {
          let hadIdList = item.templateIds.filter(function(val){
            return templateIdList.indexOf(val) > -1;
          })
          if(hadIdList.length > 0) {
            this.templateId = hadIdList[0]
          } else {
            for(let i = 0;i < item.templateIds.length;i++) {
              let idItem = item.templateIds[i];
              let res = await getTemplateInfo(idItem)
              if(res.code === 200) {
                if(res.data && res.data.templateType == this.templateType) {
                  this.templateId = idItem;
                  templateIdList.push(idItem);
                  break
                }
              }
            }
          } 
        }   
        this.requestCreateData = {
          innerCatalogId:14
        }
      },
      submitSuccess(data) {
        console.log(data)
        console.log(666)
      }
    }
  }
</script>

<style scoped>

</style>