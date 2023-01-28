<!-- 审批 --去审批,审批结果页面-->
<template>
  <div
    class="approval-detail design-form-wrap"
    ref="auditComponent"
  >
    <div class="design-form-wrap__ctnwrap">
      <el-tabs
        v-model="activeName"
        class="autoheight-tab"
      >
        <el-tab-pane
          label="审批"
          name="approval"
        >
          <div
            class="design-form"
            v-if="formData && editData"
          >
            <pc-form
              ref="generateForm"
              v-model="editData"
              :data="formData"
              :disabled="detail == 'true'"
              @onChange="handleFormDataChange"
            >
              <div slot="tableRecord">
                <ty-table
                  :showIndex="true"
                  :columns="columns"
                  :data="tableData"
                  :hidePage="true"
                ></ty-table>
              </div>
              <div
                slot="approvalFlow"
                class="approvalFlow-wrap"
              >
                <flow
                  v-if="flowData"
                  :data="flowData"
                ></flow>
              </div>
            </pc-form>
          </div>
           <slot name="approvalSlot"></slot>
        </el-tab-pane>
        <el-tab-pane
          label="任务信息"
          name="task"
        >
          <iframe
            v-if="!showIframeUrl && businessInfo.iframeUrl"
            :src="businessInfo.iframeUrl"
            class="iframe-wrap"
          >
          </iframe>
          <!-- 外部直接传入iframe -->
          <iframe
            v-if="iframeUrl && showIframeUrl"
            :src="iframeUrl"
            class="iframe-wrap"
          >
          </iframe>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="design-form-wrap__btnwrap">
      <el-button
        v-if="!detail"
        type="primary"
        size="small"
        @click="preSubmit"
      >保存</el-button>
      <el-button
        size="small"
        @click="goBackFun()"
      >返回</el-button>
    </div>

  </div>
</template>
<script>
// query参数：
// detail:是否是处理页面,如果有这个参数就是查看状态页面
import {
  getFormData
}
from "./formData";
import {
  getTaskDetailInfo,
  doTaskApproval
}
from "./api";
import flow from "./components/FlowShow";
export default {
  name: "TyApproval",
  components: {
    flow,
  },
  props: {
    iframeUrl: {
      type: String,
      default: ''
    },
    showIframeUrl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detail: false,
      flowData: null,
      activeName: "approval",
      formData: null,
      editData: {
        approvalFlag: 1,
        comment: "同意",
      },
      columns: [{
        prop: "originatorDeptName",
        label: "发起部门",
      }, {
        prop: "originatorUserName",
        label: "发起人",
        width: 100,
      }, {
        prop: "startTime",
        label: "发起时间",
      }, {
        prop: "endTime",
        label: "完成时间",
      }, {
        prop: "userName",
        label: "审批人",
        width: 100,
      }, {
        prop: "operationType",
        label: "审批结果",
        formatter: (val) => {
          var list = ["", "发起审批", "撤回", "审批通过", "审批不通过"];
          if (val <= 4) {
            return list[val];
          }
          return "-";
        },
      }, {
        prop: "comment",
        label: "审批意见",
      }, ],
      tableData: [],
      domainId: null, //业务领域id
      externalBizId: null, //业务id
      taskId: null,
      extendInfo: null, //提交审批时附带的额外信息
      nextTask:{}
    };
  },
  mounted() {
    //获取一个审批任务的详细信息
    if (this.$route.query.instanceId) {
      let params = {};
      if (this.$route.query.isTaskId) {
        params.instanceId = this.$route.query.instanceId;
      }
      else {
        params.instanceId = this.$route.query.instanceId;
      }
      getTaskDetailInfo(params).then((res) => {
        const {
          taskHistoryList,
          taskInfoList,
          domainId,
          externalBizId,
          taskId,
          extendInfo,
        } = res.data;
        this.tableData = taskHistoryList;
        this.flowData = taskInfoList;
        this.domainId = domainId;
        this.externalBizId = externalBizId;
        this.taskId = taskId;
        this.extendInfo = this.extendInfo ? JSON.parse(extendInfo) : "";
      });
    }
    this.init();
  },
  computed: {
    //业务编码获取流程领域编码
    businessInfo() {
      let iframeUrl = "";
      switch (this.domainId) {
        case 6: //变更申请审批
          iframeUrl = `#/changeManage/apply/select?id=${this.externalBizId}`;
          break;
        case 3: //变更确认审批
          const changeSureId = this.$route.query.changeSureId;
          if (changeSureId) {
            iframeUrl = `#/changeManage/confirm/select?id=${changeSureId}`;
          }
          else if (this.extendInfo.changeSureId) {
            iframeUrl = `#/changeManage/confirm/select?id=${this.extendInfo.changeSureId}`;
          }
          break;
        case 2: //考核目标审批
          const safeCheckId = this.$route.query.safeCheckId;
          iframeUrl = `#/assessment/target?id=${this.externalBizId}&isCheck=true`;
          if (safeCheckId) {
            iframeUrl += `&safeCheckId=${safeCheckId}`;
          }
          break;
        case 9: //事故快报审批
          iframeUrl = `#/accidentManage/expressNews/select?id=${this.externalBizId}`;
          break;
        case 10: //事故调查报告审批
          iframeUrl =
            `#/accidentManage/report/selectReport?id=${this.externalBizId}&investigateId=${this.extendInfo.investigateId}`;
          break;
        case 11: //作业登记审批
          iframeUrl =
            `#/constructionOperation/operationRegister/view?operatingRegistrationId=${this.externalBizId}`;
          break;
        case 12: //JSA分析
          iframeUrl = `#/constructionOperation/jsaAnalyze/view?operatingRegistrationId=${this.externalBizId}`;
          break;
        case 13: //培训考题审批
          iframeUrl = `#/education/testDataBase/check?id=${this.externalBizId}&isCheck=true`;
          break;
        case 14: //培训课件审批
          iframeUrl = `#/education/courseware/check?id=${this.externalBizId}&isCheck=true`;
          break;
        case 15: //培训计划审批
          iframeUrl = `#/education/plan/check?id=${this.externalBizId}&isCheck=true`;
          break;
        case 16: //风险辨识
          const objectType = this.$route.query.objectType;
          iframeUrl = `#/safetyRiskPartition/riskIdentification/${
            objectType == 2 ? "viewJHA" : "viewSCL"
          }?riskIdentificationId=${this.externalBizId}`;
          break;
        case 17: //固有风险审批
          iframeUrl = `#/safetyRiskPartition/riskLevel/viewInherentRiskDetail?id=${this.externalBizId}`;
          break;
        case 18: //控制风险审批
          iframeUrl = `#/safetyRiskPartition/riskLevel/viewControlRiskDetail?id=${this.externalBizId}`;
          break;
        case 19: //职业健康计划
          iframeUrl = `#/healthHygiene/healthPlan/select?id=${this.externalBizId}`;
          break;
        case 7: //承包商入驻审批
          iframeUrl = `#/contractorManage/edit?contractorInfoId=${this.externalBizId}`;
          break;
        case 20: //管理文件审批
          iframeUrl = `#/fileManage/check?id=${this.externalBizId}&isCheck=true`;
          break;
        case 21: //智慧工地项目审批
          iframeUrl = `#/projectCheck/check?id=${this.externalBizId}&isCheck=true`;
          break;
        default:
      }
      return {
        iframeUrl: iframeUrl ? `${iframeUrl}&isFrame=true` : "",
      };
    },
  },
  methods: {
    async init() {
      if (!this.editData.comment) {
        this.editData.comment = this.editData.approvalFlag === 1 ? "同意" : "不同意";
      }
      this.formData = getFormData(this.editData, !!this.$route.query.detail);
    },
    goBackFun() {
      this.$router.go(-1);
    },
    //保存前
    preSubmit(){
      this.flowData.map((item,index)=>{
        if(item.taskId==this.taskId&&index!=(this.flowData.length-1)){
            this.nextTask=this.flowData[index+1]
        }
      })
      if(this.nextTask.approvalNodeType==1&&!this.nextTask.actionerIds){
        this.$emit("selectApproval",this.nextTask)
      }else{
        this.handleSubmit()
      }
    },
    // 保存
    handleSubmit() {
      this.$refs.generateForm.getData().then((data) => {
        const {
          approvalFlag,
          comment
        } = this.editData;
        const postData = {
          approvalFlag: !!approvalFlag, //审批通过标准，1-审批通过，0-拒绝
          comment, //审批的意见文字记录
          // "reviewerUserId": 0,
          // "step": 0,
          taskId: this.taskId,
        };
        //审批任务
        doTaskApproval(postData).then((res) => {
          const {
            ...query
          } = this.$route.query;
          this.$router.replace({
            query: {
              ...query,
              detail: true
            }
          });
          // this.$router.replace({
          //   path: "/approval/needDo",
          // });
        });
      }).catch((e) => {
        console.log(e);
      });
    },
    handleFormDataChange(fields, value) {
      if (fields === "approvalFlag") {
        const {
          comment
        } = this.editData;
        // 如果审批意见为空，设置默认值
        if (comment) return;
        this.editData.comment = value === 1 ? "同意" : "不同意";
      }
    },
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.detail = val.query.detail || false
      },
      // 深度观察监听
      deep: true,
      immediate: true
    }
  },
};

</script>
<style
  lang="scss"
  scoped
>
.approval-detail {
  .design-form-wrap__ctnwrap {
    padding: 0;
  }
}

.approvalFlow-wrap {
  position: relative;

  &::after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(255, 255, 255, 0);
    content: "";
  }
}

.iframe-wrap {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: auto;
  border: 0;
}

</style>
