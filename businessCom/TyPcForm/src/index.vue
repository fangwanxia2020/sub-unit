<template>
  <div>
    <pc-form
      v-if="templateJsonData"
      :data="templateJsonData"
      v-model="editData"
      :disabled="detailFlag"
      ref="generateForm"
    ></pc-form>
    <div class="fmBox-btn" v-if="templateJsonData">
      <el-button
        v-if="submitBtnShow && !detailFlag"
        type="primary"
        @click="handleSubmit"
        size="medium"
        >{{ submitBtnText }}</el-button
      >
      <el-button
        v-if="backBtnShow"
        type="primary"
        @click="handleBack"
        size="medium"
        >{{ backBtnText }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { handleTemplateRequest,submitTemplateRequest } from "./api";
import {
  commonType,
  handleCommon,
  handleGrid,
  handleBind,
  handleCommonReq,
  handleGridReq,
  handleBindReq,
  handleCustomAttr,
  handleCustomAttrReq,
  handleUploadFile,
} from "./handleData";
import {
  TEMPLATE_SERVICE_INTERFACE_ID,
  ATTR_KEY,
  TEMPLATE_TYPE,
  ADD,
  EDIT,
  DETAIL,
} from "./constants";
export default {
  name: "TyPcForm",
  data() {
    return {
      templateJsonData: null,
      editData: {
        cascader_1667201801000_41411:[3,16]
      },
      interfaceInfoVoList: [],
    };
  },
  props: {
    submitBtnShow: {
      type: Boolean,
      default: true,
    },
    submitBtnText: {
      type: String,
      default: "提交",
    },
    backBtnShow: {
      type: Boolean,
      default: true,
    },
    backBtnText: {
      type: String,
      default: "返回",
    },
    apiObj: {
      type: Object,
      default: () => {
        return {
          url: "/basic/configuration",
          methodType: "get",
        };
      },
    },
    apiData: {
      required: true,
      default: "",
    },
    requestCreateData: {
      require: false,
      type: Object,
      default: () => {
        return {};
      },
    },
    requestEditData: {
      require: false,
      type: Object,
      default: () => {
        return {};
      },
    },
    detailData: {
      require: false,
      default: "",
    },
    detailFlag: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  watch: {
    apiData(newVal) {
      if (newVal) this.getTemplateDetailFun();
    },
  },
  mounted() {
    if (this.apiData) this.getTemplateDetailFun();
  },
  methods: {
    getTemplateDetailFun() {
      handleTemplateRequest(this.apiData, this.apiObj).then(async (res) => {
        if (res.code === 200) {
          let data = res.data;
          this.templateJsonData = JSON.parse(data.templateJson);
          this.interfaceInfoVoList = data.interfaceInfoVoList;
          let templateJsonList = JSON.parse(
            JSON.stringify(this.templateJsonData.list)
          );
          console.log(templateJsonList,'templateJsonList');
          const reg = new RegExp(/\{([^}]+)\}/g);
          const routes = this.$route.query;
          let obj = {};
          for (let i = 0; i < this.interfaceInfoVoList.length; i++) {
            let item = this.interfaceInfoVoList[i];
            if (item.interfaceType === TEMPLATE_TYPE[DETAIL]) {
              let detailReqData = null
              let url = item.interfaceUrl
              let regContent = reg.exec(url);
              if(item.invokeMode.toUpperCase() === 'POST') {
                detailReqData = routes
              } else if(item.invokeMode.toUpperCase() === 'GET' && regContent){
                const id = routes[regContent[1]];
                url = url.slice(0, regContent.index);
                detailReqData = id;
              }
              if (this.detailData) {
                detailReqData = this.detailData;
              }
              let response = await submitTemplateRequest(detailReqData, {
                url,
                methodType: item.invokeMode,
              });
              if (response.code === 200) {
                let resData = response.data;
                if (this.$listeners.getDetail)
                  this.$emit("getDetail", resData);
                for (let j = 0; j < templateJsonList.length; j++) {
                  let templateJsonItem = templateJsonList[j];
                  if (commonType.includes(templateJsonItem.type) || templateJsonItem.type === "imgupload") {
                    handleCommonReq(templateJsonItem, obj, resData);
                  } else if (templateJsonItem.type === "grid") {
                    handleGridReq(templateJsonItem, obj, resData);
                  } else if (templateJsonItem.type === "binding") {
                    handleBindReq(
                      templateJsonItem,
                      obj,
                      resData,
                      this.templateJsonData.list,
                      j
                    );
                  } else if (templateJsonItem.type === "customAttr") {
                    handleCustomAttrReq(templateJsonItem, obj, resData);
                  }
                }
              }
            }
          }
          this.editData = { ...obj };
        }
      });
    },
    handleSubmit() {
      this.$refs.generateForm.getData().then((data) => {
        const paramMap = new Map();
        this.interfaceInfoVoList.forEach((item) => {
          paramMap.set(item[TEMPLATE_SERVICE_INTERFACE_ID], {});
        });
        const routes = this.$route.query;
        for (let i = 0; i < this.templateJsonData.list.length; i++) {
          let item = this.templateJsonData.list[i];
          if (item.type === "grid") {
            handleGrid(item, paramMap, data);
          } else if (item.type === "binding") {
            handleBind(item, paramMap, data);
          } else if (item.type === "customAttr") {
            handleCustomAttr(item, paramMap, data);
          } else if (item.type === "imgupload") {
            handleUploadFile(item, paramMap, data);
          } else if (commonType.includes(item.type)) {
            handleCommon(item, paramMap, data);
          }
        }
        let msgContent = "";
        this.interfaceInfoVoList.forEach((item) => {
          let reqData = paramMap.get(item[TEMPLATE_SERVICE_INTERFACE_ID]);
          if (
            item.interfaceType === TEMPLATE_TYPE[ADD] ||
            item.interfaceType === TEMPLATE_TYPE[EDIT]
          ) {
            if (item.interfaceType === TEMPLATE_TYPE[EDIT]) {
              msgContent = "修改成功";
              for (let j = 0; j < item.attrVoList.length; j++) {
                let attrVoItem = item.attrVoList[j];
                if (attrVoItem.isPrimary == 1) {
                  reqData[attrVoItem[ATTR_KEY]] = routes[attrVoItem[ATTR_KEY]];
                  break;
                }
              }
              reqData = { ...reqData, ...this.requestEditData, ...routes };
            } else if (item.interfaceType === TEMPLATE_TYPE[ADD]) {
              reqData = { ...reqData, ...this.requestCreateData, ...routes };
              msgContent = "新建成功";
            }
            submitTemplateRequest(reqData, {
              url: item.interfaceUrl,
              methodType: item.invokeMode,
            }).then((res) => {
              if (res.code === 200) {
                if (this.$listeners.submitSuccess) {
                  this.$emit("submitSuccess", res.data);
                } else {
                  msgContent && this.$message.success(msgContent);
                  this.$router.go(-1);
                }
              }
            });
          }
        });
      });
    },
    handleBack() {
      if (this.$listeners.goBack) {
        this.$emit("goBack");
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.fmBox-btn {
  text-align: center;
}
</style>
