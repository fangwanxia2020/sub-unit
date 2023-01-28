<!--审批操作按钮-->
<template>
  <div
    class="approval-btn"
    v-if="flowStatus && [1, 2, 3, 4].indexOf(flowStatus) >= 0"
  >
    <el-button
      v-if="flowStatus == '1'"
      :type="btnType"
      :size="btnSize"
      :disabled="goApprovalDisabled"
      @click="goApprovalFun()"
    > 提交审批</el-button>
    <el-button
      v-if="flowStatus == '4'"
      :type="btnType"
      :size="btnSize"
      @click="goApprovalFun(true)"
    >重新发起审批</el-button>
    <el-button
      v-if="flowStatus == '2'"
      :type="btnType"
      :size="btnSize"
      @click="cancelApproval()"
    > 撤回 </el-button>
    <!-- &&(isCanDoApproval) -->
    <el-button
      v-if="flowStatus && [2, 3, 4].indexOf(flowStatus) >= 0"
      :type="btnType"
      :size="btnSize"
      @click="goSawApprovalFun()"
    > 审批记录 </el-button>
    <ty-dialog
      width="380px"
      :show.sync="dialogVisible"
      :appendToBody="true"
      :onClose="closeDialog"
      :onOk="submitDialog"
      title="请选择流程"
    >
      <div class="selectFlowBox">
        <ty-radio
          :options="procListRadio"
          v-model="selectProc"
        ></ty-radio>
      </div>
    </ty-dialog>
  </div>
</template>
<script>
import {
  getFlowsDefineList,
  getInfoByConfigType,
  getInstanceInfoId,
  instantiateFlow,
  noInstance,
  cancelApproval,
}
from "./api";
import TyRadio from "components/TyRadio";
export default {
  name: "TyApprovalBtn",
  components: {
    TyRadio,
  },
  props: {
    //流程的状态
    //1：还没提交审批---提交审批
    //2:审批中，审批结束---------查看审批记录
    //3:审批通过------ 查看审批记录
    //4:审批不通过------重新发起审批，查看审批记录
    flowStatus: {
      type: [String, Number],
      default: "1",
    },
    //当前的值
    data: {
      type: Object,
    },
    // 业务编码 businessCode
    //承包商入驻审批 contractor
    //变更申请审批 changeRequest
    //变更确认审批 changeConfirm
    //考核目标审批 assessment
    //事故快报审批 accidentReport
    //事故调查报告审批 accidentInvestigation
    //作业登记审批 jobRegistration
    //JSA分析     JSAanalysis
    //培训考题审批 trainingQuestions
    //培训课件审批 trainingCourseware
    //培训计划审批 trainingPlan
    //风险辨识     riskIdentification
    businessCode: {
      type: [String],
      default: "contractor",
    },
    //业务id
    businessId: {
      type: [String, Number],
    },
    //工作流回调的附带信息
    extendInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //表单标题名称
    formTitleName: {
      type: [String],
      default: "",
    },
    //需要添加的路由参数
    actionparams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //业务信息
    businessMsg: {
      type: Object,
    },
    //提交审批前处理方法
    beforeApproval: {
      type: Function,
    },
    btnType: {
      type: String,
      default: "text"
    },
    btnSize: {
      type: String,
      default: "mini"
    },
  },
  computed: {
    //是否需要显示审批操作，在子应用中不显示审批处理跳转
    isCanDoApproval() {
      const {
        global = {
          isInBaseSite: true,
        },
      } = this.$store.state;
      return !!global.isInBaseSite;
    },
    //业务编码获取流程领域编码
    businessInfo() {
      let domainId = "";
      let procName = "";
      switch (this.businessCode) {
        case "changeRequest": //变更申请审批
          domainId = "6";
          procName = `${this.formTitleName}变更申请`;
          break;
        case "changeConfirm": //变更确认审批
          domainId = "3";
          procName = `${this.formTitleName}变更确认`;
          break;
        case "assessment": //考核目标审批
          domainId = "2";
          procName = `${this.formTitleName}`;
          break;
        case "accidentReport": //事故快报审批
          domainId = "9";
          procName = `${this.formTitleName}事故快报审批`;
          break;
        case "accidentInvestigation": //事故调查报告审批
          domainId = "10";
          procName = `${this.formTitleName}事故调查报告审批`;
          break;
        case "jobRegistration": //作业登记审批
          domainId = "11";
          procName = `作业登记${this.formTitleName}`;
          break;
        case "JSAanalysis": //JSA分析
          domainId = "12";
          procName = `JAS分析${this.formTitleName}`;
          break;
        case "trainingQuestions": //培训考题审批
          domainId = "13";
          procName = `培训考题${this.formTitleName}`;
          break;
        case "trainingCourseware": //培训课件审批
          domainId = "14";
          procName = `培训课件${this.formTitleName}`;
          break;
        case "trainingPlan": //培训计划审批
          domainId = "15";
          procName = `培训计划${this.formTitleName}`;
          break;
        case "riskIdentification": //风险辨识
          domainId = "16";
          procName = `${this.formTitleName}风险辨识`;
          break;
        case "inherentRisk": //固有风险审批
          domainId = "17";
          procName = `${this.formTitleName}固有风险评估审批`;
          break;
        case "controlRisk": //控制风险审批
          domainId = "18";
          procName = `${this.formTitleName}控制风险评估审批`;
          break;
        case "healthyInfo": //职业建康计划
          domainId = "19";
          procName = `职业建康${this.formTitleName}`;
          break;
        case "lawManageDocument": //管理文件审批
          domainId = "20";
          procName = `管理文件${this.formTitleName}`;
          break;
        case "itemProject": //智慧工地项目审批
          domainId = "21";
          procName = `工地项目${this.formTitleName}`;
          break;
        default:
          //承包商入驻审批
          domainId = "7";
          procName = `${this.formTitleName}入驻审批`;
      }
      return {
        domainId,
        procName,
      };
    },
    procListRadio() {
      return this.procList.map((item) => {
        return {
          label: item.procName,
          value: item.defineId,
        };
      });
    },
    selectProcObject() {
      return this.procList.find((item) => item.defineId == this.selectProc);
    },
  },
  data() {
    return {
      goApprovalDisabled: false, //提交审批的禁用状态
      procList: [], //开启的流程列表
      dialogVisible: false,
      selectProc: "", //当前选择的流程
      infoByConfig: {}, //实例需要的参数
    };
  },
  watch: {},
  methods: {
    //获取实例id
    getInstanceInfoIdFun() {
      return new Promise((resolve) => {
        // const {
        //   externalBizFuncionName,
        //   externalBizRegion
        // } = this.infoByConfig
        const {
          domainId
        } = this.businessMsg || this.businessInfo;
        const params = {
          domainId,
          externalBizId: this.businessId.toString(),
        };
        getInstanceInfoId(params).then((res) => {
          resolve(res.data);
        });
      });
    },
    //获取实例需要的参数
    getInfoByConfigFun() {
      return new Promise((resolve) => {
        getInfoByConfigType(this.businessCode).then((resons) => {
          const {
            systemName,
            preFormAddress,
            methodUrl
          } = resons.data;
          this.infoByConfig = {
            externalBizFuncionName: methodUrl, //外部业务功能名称，分布式中，可对应某微服务下的业务功能点名称
            externalUrlPrefix: preFormAddress, //外部业务功能url前缀(备用)
            externalBizRegion: systemName, //外部业务区域范围,分布式中，可对应着微服务名
          };
          resolve(this.infoByConfig);
        });
      });
    },
    //撤回
    async cancelApproval() {
      this.$confirm("是否撤回当前审批?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.confirmCancelApproval();
      }).catch(function() {});
    },
    //确认撤回
    async confirmCancelApproval() {
      const instanceId = await this.getInstanceInfoIdFun();
      cancelApproval({
        instanceId
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
        }
        else {
          this.$message.error(res.msg);
        }
        this.$emit("refresh");
      });
    },
    //实例化一个流程 （isReturn：是否重新发起审批）
    async goApprovalFun(isReturn) {
      if (this.beforeApproval) {
        const fun = await this.beforeApproval(this.businessId);
        if (!fun) return;
      }
      this.goApprovalDisabled = true;
      const {
        domainId
      } = this.businessMsg || this.businessInfo;
      //查询是否需要审批，不需要则直接通知修改状态
      var noInstanceFlag = true;
      await noInstance({
        domainId,
        externalBizId: this.businessId,
        extendInfo: JSON.stringify(this.extendInfo),
      }).then((res) => {
        noInstanceFlag = res.data;
      });
      if (noInstanceFlag == true) {
        this.$message.success("已配置不需要审批，默认通过");
        this.$emit("refresh");
        return;
      }
      //查询开启的流程模板
      getFlowsDefineList({
        deployFlag: 1,
        domainId,
        pageNum: 1,
        pageSize: 9999,
      }).then((res) => {
        this.procList = res.data.records;
        if (this.procList.length == 0) {
          this.$message.warning("暂无流程模板！");
          this.goApprovalDisabled = false;
          return;
        }
        if (this.procList.length == 1) {
          this.selectProc = this.procList[0].defineId;
          this.submitDialog();
          return;
        }
        this.dialogVisible = true;
      }).catch((err) => {
        this.goApprovalDisabled = false;
      });
    },
    //查看审批记录
    async goSawApprovalFun() {
      //获取实例化需要的参数
      await this.getInfoByConfigFun();
      const instanceId = await this.getInstanceInfoIdFun();
      if (!instanceId) {
        this.$message.warning("此条数据默认审批通过，无审批记录");
        return;
      }
      this.$router.push({
        path: "/approvalhandle/hasdo?detail=true",
        query: {
          instanceId,
          ...this.actionparams,
        },
      });
    },
    //点击dialog确认按钮,实例流程
    async submitDialog() {
      if (!this.selectProc) {
        this.$message.warning("请选择流程模板！");
        return;
      }
      //获取实例化需要的参数
      // await this.getInfoByConfigFun();
      const {
        defineId
      } = this.selectProcObject;
      const {
        procName
      } = this.businessMsg || this.businessInfo;
      //实例化一个流程
      const postData = {
        externalBizId: this.businessId.toString(), //具体业务系统业务id
        defineId: defineId, //流程定义id
        instanceName: procName, //实例名称
        extendInfo: JSON.stringify(this.extendInfo), //扩展信息
      };
      instantiateFlow(postData).then((res) => {
        this.$message.success("提交审批成功");
        this.$emit("refresh");
        this.closeDialog();
      }).catch((res) => {
        this.closeDialog();
      });
    },
    //关闭dialog
    closeDialog() {
      this.selectProc = "";
      this.dialogVisible = false;
      this.goApprovalDisabled = false;
    },
  },
};

</script>
<style
  scoped
  lang="scss"
>
.approval-btn {
  display: inline-block;
  margin-right: 10px;
}

.selectFlowBox {
  max-height: 300px;
  overflow: auto;

  ::v-deep .el-radio {
    margin-bottom: 15px;

    .el-radio__label {
      font-size: 18px;
    }
  }
}

</style>
