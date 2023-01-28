<template>
  <div class="fmDesign-wrap">
    <el-container class="fmDesign">
      <el-aside width="200px">
        <fm-menu :typeModel="typeModel"></fm-menu>
      </el-aside>
      <el-main class="fmDesign__center">
        <div class="fmDesign__center__ctn">
          <el-main
            :class="{'fmDesign__center--empty': widgetForm.list.length == 0,'fmDesign__center__ctt':true,'mobile':typeModel=='mobile','nonColumn':widgetForm.config.column=='nonColumn'}"
          >
            <fm-ctn
              ref="widgetForm"
              :data="widgetForm"
              :typeModel="typeModel"
              :select.sync="widgetFormSelect"
            ></fm-ctn>
          </el-main>
          <el-footer class="fmDesign__center__btnbar">
            <el-button
              v-if="importTemplate"
              type="text"
              size="medium"
              icon="el-icon-tickets"
              @click="importTemplateFun"
            >导入模板</el-button>
            <el-button
              v-if="generateJson"
              type="text"
              size="medium"
              icon="el-icon-tickets"
              @click="showJson"
            >查看Json</el-button>
            <el-button
              v-if="generateCode"
              type="text"
              size="medium"
              icon="el-icon-video-play"
              @click="run"
            >运行</el-button>
            <el-button
              type="text"
              size="medium"
              v-if="clearable"
              icon="el-icon-delete"
              @click="handleClear"
            >清空</el-button>
            <el-button
              v-if="save"
              type="text"
              size="medium"
              icon="el-icon-tickets"
              @click="handleGenerateJson"
            >保存</el-button>
          </el-footer>
        </div>
      </el-main>
      <el-aside width="280px">
        <slot name="formConfig"></slot>
        <fm-config
          :data="widgetForm"
          v-bind="$attrs"
          :select="widgetFormSelect"
        ></fm-config>
      </el-aside>
      <!--选择类型窗口 -->
      <!-- <ty-dialog
        :show.sync="dialogVisible"
        title="选择生成类型"
        :onOk="generateFun"
        width="400px"
      >
        <el-row :gutter="15">
          <el-col :span="8">
            <div style="text-align:right;line-height:30px;">生成类型</div>
          </el-col>
          <el-col :span="16">
            <el-radio-group v-model="generateCodeType">
              <el-radio-button label="pc">pc</el-radio-button>
              <el-radio-button label="mobile">mobile</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </ty-dialog> -->
      <!-- 查看代码 -->
      <form-drawer
        :visible.sync="drawerVisible"
        :form-data="widgetForm"
        size="100%"
        :type="typeModel"
      />
      <!-- 查看json -->
      <json-drawer
        size="60%"
        :visible.sync="jsonDrawerVisible"
        :json-str="JSON.stringify(widgetForm) "
        @refresh="refreshJson"
      />
      <!--选择模板 -->
      <ty-dialog
        :show.sync="selectTemplateVisible"
        title="选择模板"
        :showFooter="false"
        width="500px"
      >
        <ty-table
          :columns="columns"
          :data="tableData"
          :pager="page"
          @pageSizeChange="handleSizeChange"
          @pageCurrentChange="handleCurrentChange"
          @selectTableList="selectTableList"
        ></ty-table>
      </ty-dialog>
    </el-container>
  </div>
</template>
<script>
/**
 * 组件名称 FmDesign
 * @module components/fmDesign/FmDesign
 * @desc 表单设计器
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Boolean} [importTemplate] -是否带导入模板功能
 * @param {Boolean} [generateCode] - 是否带在线运行功能
 * @param {Boolean} [generateJson] - 是否显示查看表单json功能
 * @param {Boolean} [clearable] - 是否显示清空功能
 * @param {Boolean} [save] - 是否显示保存功能
 * @example 调用示例
 *  <fm-design></fm-design>
 **/
import templateList from "./json/template";
import TyTable from "components/TyTable";
import FormDrawer from "./formDrawer";
import JsonDrawer from "./JsonDrawer";
import formJson from "./json/formJson";
import FmMenu from "./FmMenu";
import FmCtn from "./fmCtn";
import FmConfig from "./fmConfig";
import TyDialog from "components/TyDialog";
import PcForm from "components/PcForm";
import { eventBus } from "./eventBus/bindEventBus";
export default {
  name: "FmDesign",
  components: {
    FmMenu,
    FmCtn,
    FmConfig,
    TyDialog,
    PcForm,
    JsonDrawer,
    FormDrawer,
    TyTable
  },
  props: {
    importTemplate: {
      //导入模板
      type: Boolean,
      default: true
    },
    generateCode: {
      //运行
      type: Boolean,
      default: true
    },
    generateJson: {
      //查看Json
      type: Boolean,
      default: true
    },
    clearable: {
      //清空
      type: Boolean,
      default: true
    },
    save: {
      //保存
      type: Boolean,
      default: true
    },
    businessComponent: {
      //业务组件
      type: Object,
      default: () => {
        return {
          pc: [],
          mobile: []
        }
      }
    },
    templateJson: {
      //模板数据
      type: Object
    }
  },
  data() {
    return {
      typeModel: "pc",
      activeName: "first",
      widgetFormSelect: null,
      widgetForm: this.initDataFun(),
      widgetModels: {},
      jsonDrawerVisible: false,
      drawerVisible: false,
      // dialogVisible: false,
      generateCodeType: "pc",
      selectTemplateVisible: false,
      columns: [{
        prop: "name",
        label: "模板名"
      }],
      tableData: [],
      page: {
        pageNo: 1,
        limit: 10,
        sizes: [10, 50, 100],
        total: 0
      },
    };
  },
  provide() {
    return {
      fmDesign: this
    }
  },
  watch: {
    typeModel(val) {
      //this.handleClear();
    },
    templateJson: {
      deep: true,
      handler(val) {
        this.setJSON(val);
      }
    },
  },
  mounted() {
    this.tableData = templateList;
    this.page.total = this.tableData.length;
    //初始化模板数据
    if (this.templateJson) {
      this.setJSON(this.templateJson);
    }
  },
  methods: {
    //初始化数据
    initDataFun() {
      const key = Date.parse(new Date());
      let formJson = {
        list: [],
        config: {
          id: "form_" + key,
          labelWidth: 130,
          labelPosition: "right",
          size: "medium",
          column: "column",
          formName: "表单组件"
        }
      };
      return formJson;
    },
    //设置表单值
    setJSON(json) {
      this.widgetForm = json;
      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0];
      }
    },
    //清空
    handleClear() {
      this.widgetForm = this.initDataFun();
      this.widgetFormSelect = {};
    },
    //提交
    handleSubmit() {
      this.$refs.pcForm.getData().then(data => {
        this.$alert(data, "").catch(e => {});
      }).catch(e => {});
    },
    //重置
    handleReset() {
      this.$refs.pcForm.reset();
    },
    //表单的值发生变化触发的事项
    handleDataChange(field, value, data) {
      console.log(field, value, data);
    },
    //保存
    handleGenerateJson() {
      //console.log(JSON.stringify(this.widgetForm));
      //this.$alert(`请看控制台输出`, "").catch(e => {});
      this.$emit("save", this.widgetForm);
    },
    //查看json
    showJson() {
      this.jsonDrawerVisible = true;
    },
    //刷新json数据
    refreshJson(data) {
      this.setJSON(data);
      this.jsonDrawerVisible = false;
    },
    //选择代码类型
    run() {
      this.drawerVisible = true;
    },
    //导入模板
    importTemplateFun() {
      this.selectTemplateVisible = true;
    },
    // 重新渲染name列
    formatter(row, column, cellValue) {
      return "hello " + row.name;
    },
    // 改变页面大小处理
    handleSizeChange(val) {},
    // 翻页处理
    handleCurrentChange(val) {},
    //选择模板
    selectTableList(val) {
      this.selectTemplateVisible = false;
      const {
        template
      } = val;
      this.setJSON(template);
    }
  },
  beforeDestroy(){
    eventBus.$off("getSelectWidget");
    eventBus.$off('getParentData');
  },
};

</script>
<style lang="scss">
@import "./css/variable.scss";

.fmDesign__center__ctn {
  display: flex;
  flex-direction: column;
  height: 100%;

  .fmDesign__center__ctt {
    flex: 1;
    overflow: auto;

    //移动端样式
    &.mobile {
      width: 320px;
      height: 568px;
      margin: 0 auto;
      border: solid 10px #000000;
      background: #F1F5F7;

      .widget-col {
        &.el-row--flex {
          flex-wrap: wrap;

          .el-col {
            width: 100% !important;
          }
        }
      }
      
      .el-form--label-top,
      .el-input-number {
        .el-input__inner {
          border: 1px solid #ddd !important;
          height: auto !important;
        }
      }
      
      &.nonColumn {
        padding: 0 20px;

        .form-title {
          a {
            span {
              color: inherit !important;
            }
          }
        }
        
        .titleCom+.formItemOBJ {
          margin-top: 0;
        }
        
        .formItemOBJ {
          margin-top: 20px;
        }
        
        .formItemOBJ+.formItemOBJ {
          margin-top: 0;
        }
      }
      
      .widget-form-container .widget-form-list {
        background: transparent;
        margin: 0;
      }
      
      .widget-view {
        background: #fff;
        border-bottom: 1px solid #EDEDED;
        padding: 10px 10px 10px;
        margin: 0;

        &.borRadius_top {
          border-radius: 10px 10px 0 0;
        }
        
        &.borRadius_bottom {
          border-radius: 0 0 10px 10px;
        }
        
        &.titleCom {
          padding: 5px 10px 5px;
          background: transparent;
          border: 0;

          .form-title {
            a {
              text-decoration: none;

              span {
                color: #757575;
              }
            }
          }
        }
        
        .ty-upload-file {
          text-align: right;
        }
        
        .el-date-editor .el-input__prefix {
          display: none;
        }
        
        .el-form-item__label {
          line-height: 40px;
        }
        
        .el-input__inner {
          border: 0;
          height: 40px;
        }
        
        .el-textarea__inner {
          background: #f6f6f6;
          border-radius: 4px;
          border: 0;
        }
        
        .widget-view-action {
          right: 0;
          bottom: 0;
        }
      }
    }
  }
  
  .fmDesign__center__btnbar {
    height: 45px;
    text-align: center;
    padding: 10px;
    background: #f1f1f1;
    border-top: 1px solid #ddd;

    .el-button--text {
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.fmDesign-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;

  .fmDesign-wrap-head {
    padding: 4px 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }
  
  .fmDesign {
    flex: 1;
  }
  
  .fmDesign__center {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    position: relative;
    padding: 0;

    .el-main {
      padding: 0;
    }
  }
}

.fmDesign {

  /*修改滚动条样式*/
  ::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 6px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
  
  ::-webkit-scrollbar-corner {
    background: #179a16;
  }
  
  background: #fff;
  height: 100%;
  border: 1px solid #e0e0e0;

  .el-container {
    height: 100% !important;
  }
  
  &>.el-container {
    background: #fff;
  }
}

</style>
