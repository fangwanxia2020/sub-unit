<template>
  <div class="ty-business-crud">
    <!--查询设置-->
    <ty-dialog
      :show.sync="dialogVisible"
      :appendToBody="true"
      title="设置查询字段"
      :onOk="handleSearchColumnsChange"
    >
      <el-checkbox-group v-model="checkedSearchColumns">
        <el-checkbox
          v-for="(col, index) in columns"
          :label="col.prop"
          :key="index"
          >{{ col.label }}</el-checkbox
        >
      </el-checkbox-group>
    </ty-dialog>
    <!--新建/修改-->
    <edit-dialog
      :show.sync="editDialogVisible"
      :data="editObj"
      :editFormData="editFormData"
      :disabled="editFormDisabled"
      @refresh="refreshFun"
    >
      <div>
        <slot name="detail"></slot>
      </div>
    </edit-dialog>
    <div class="ty-business-crud__title" v-if="title">{{ title }}</div>
    <ty-table
      :size="size"
      :id="id"
      ref="tableObj"
      :columns="columns"
      :data="tableData"
      :pager="page"
      :showSelect="showSelect"
      :showIndex="showIndex"
      :checkList.sync="selectedList"
      :hidePage="hidePage"
      :border="border"
      :stripe="stripe"
      :allAlign="allAlign"
      :default-sort="defaultSort"
      :treeProps="treeProps"
      :lazy="lazy"
      :loadTree="loadTree"
      :default-expand-all="defaultExpandAll"
      :checkboxControl="checkboxControl"
      :spanControl="spanControl"
      @select-all="$emit('select-all', $event)"
      @selectionChange="handleSelectionChange"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @select="handleSelectFun"
      @sort-change="handleSortChage"
    >
      <div class="searchBox-wrapper" slot="table_oper">
        <template v-if="searchMode == 'high'">
          <template v-if="showSearch">
            <div class="searchBox-high">
              <div class="searchBox-form">
                <pc-form
                  :label-suffix="searchFormLabelSuffix"
                  :rowNum="2"
                  :key="searchFormKey"
                  :data="searchFormJsonData"
                  v-model="searchFormData"
                  ref="searchGenerateForm"
                  @keyup.enter.native="goSearch"
                >
                  <template #form-content-before>
                    <slot name="baseSearch" />
                  </template>
                  <template #searchBtnSlot>
                    <div class="searchBox-btn">
                      <el-button type="primary" @click="searchFun" size="small"
                        >查询</el-button
                      >
                      <el-button @click="resetSearch" size="small"
                        >重置</el-button
                      >
                      <el-link
                        type="primary"
                        class="high-link"
                        @click="searchHighFun"
                        >高级查询
                        <i class="el-icon-arrow-up" v-if="searchHigh"></i>
                        <i class="el-icon-arrow-down" v-else></i>
                      </el-link>
                    </div>
                  </template>
                  <template #form-content>
                    <slot name="search" />
                  </template>
                </pc-form>
              </div>
            </div>
          </template>
          <div class="searchBox-high-operator-bar">
            <span v-if="showOperation.indexOf('add') >= 0">
              <el-button size="small" @click="editFun()" type="primary"
                >新建</el-button
              >
            </span>

            <div :class="alignRight ? 'align-right' : ''">
              <slot name="operator"></slot>

              <div v-if="showMoreOperator">
                <div class="more">
                  <el-button type="primary" size="small" @click="showMore">
                    更多
                    <i
                      :class="
                        showBtnList ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                      "
                    ></i>
                  </el-button>
                  <ul v-if="showBtnList" class="more-btn">
                    <li
                      v-for="(item, index) in btnOptions"
                      :key="index"
                      class="more-btn-li"
                    >
                      <el-button
                        @click="item.btnMethods"
                        :type="item.buttonType || 'primary'"
                        :plain="item.plain"
                        :size="item.buttonSize || 'small'"
                        :icon="item.icon ? item.icon : ''"
                        :disabled="item.disabled"
                      >
                        {{ item.btnName }}
                        <i :class="item.iClass ? item.iClass : ''"></i>
                      </el-button>
                    </li>
                    <slot name="operatorMore"></slot>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="searchBox">
            <div class="searchBox-form">
              <template v-if="showSearch">
                <pc-form
                  :rowNum="2"
                  :label-suffix="searchFormLabelSuffix"
                  :key="searchFormKey"
                  :data="searchFormJsonData"
                  v-model="searchFormData"
                  ref="searchGenerateForm"
                  @keyup.enter.native="goSearch"
                >
                  <template slot="form-content">
                    <slot name="search"></slot>
                    <div class="searchBox-btn">
                      <template v-if="showSearch">
                        <el-button type="primary" @click="searchFun" size="small"
                        >查询</el-button
                      >
                      <el-button @click="resetSearch" size="small"
                        >重置</el-button
                      >
                        <el-button
                          v-if="canSetsearchField"
                          type="primary"
                          size="small"
                          @click="searchSetFun"
                          >查询字段配置</el-button
                        >
                      </template>
                      <template v-if="searchMode == 'default'">
                        <span v-if="showOperation.indexOf('add') >= 0">
                          <span class="line" v-if="showSearch"></span>
                          <el-button
                            size="small"
                            @click="editFun()"
                            type="primary"
                            >新建</el-button
                          >
                        </span>
                        <slot name="operator"></slot>
                      </template>
                    </div>
                  </template>
                </pc-form>
              </template>
            </div>
          </div>
          <div
            class="default-more"
            v-if="showMoreOperator && searchMode == 'default'"
          >
            <div class="more">
              <el-button type="primary" size="small" @click="showMore">
                更多
                <i
                  :class="
                    showBtnList ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                  "
                ></i>
              </el-button>
              <ul v-if="showBtnList" class="more-btn">
                <li
                  v-for="(item, index) in btnOptions"
                  :key="index"
                  class="more-btn-li"
                >
                  <el-button
                    @click="item.btnMethods"
                    :type="item.buttonType || 'primary'"
                    :plain="item.plain"
                    :size="item.buttonSize || 'small'"
                    :icon="item.icon ? item.icon : ''"
                    :disabled="item.disabled"
                  >
                    {{ item.btnName }}
                    <i :class="item.iClass ? item.iClass : ''"></i>
                  </el-button>
                </li>
                <slot name="operatorMore"></slot>
              </ul>
            </div>
          </div>
          <template v-if="searchMode == 'base'">
            <div class="searchBox-high-operator-bar">
              <span v-if="showOperation.indexOf('add') >= 0">
                <el-button size="small" @click="editFun()" type="primary"
                  >新建</el-button
                >
              </span>

              <!-- <slot name="operator"></slot> -->
            </div>
            <div :class="alignRight ? 'align-right base-more' : ''">
              <slot name="operator"></slot>
              <div v-show="showMoreOperator">
                <div class="more">
                  <el-button type="primary" size="small" @click="showMore">
                    更多
                    <i
                      :class="
                        showBtnList ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                      "
                    ></i>
                  </el-button>
                  <ul v-if="showBtnList" class="more-btn">
                    <li
                      v-for="(item, index) in btnOptions"
                      :key="index"
                      class="more-btn-li"
                    >
                      <el-button
                        @click="item.btnMethods"
                        :type="item.buttonType || 'primary'"
                        :plain="item.plain"
                        :size="item.buttonSize || 'small'"
                        :icon="item.icon ? item.icon : ''"
                        :disabled="item.disabled"
                      >
                        {{ item.btnName }}
                        <i :class="item.iClass ? item.iClass : ''"></i>
                      </el-button>
                    </li>
                    <slot name="operatorMore"></slot>
                  </ul>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
      <template #btns_bar>
        <slot name="btnsBar" />
      </template>
      <template v-for="col in slotColumns" v-slot:[col.prop]="{ data,index }">
        <slot :name="col.prop" :data="data" :index="index" />
      </template>
      <template v-slot:operation="scope">
        <slot name="rowOperator" v-bind:row="scope.row"></slot>
        <el-button
          @click="editFun(scope.row, true)"
          :type="buttonType"
          :plain="buttonType != 'text'"
          :size="buttonSize"
          v-if="showOperation.indexOf('detail') >= 0"
          >详情</el-button
        >
        <el-button
          @click="editFun(scope.row, false)"
          :type="buttonType"
          :size="buttonSize"
          :plain="buttonType != 'text'"
          v-if="showOperation.indexOf('update') >= 0"
        >
          修改
        </el-button>
        <el-button
          @click="delectRow(scope.row)"
          :type="buttonType"
          :size="buttonSize"
          :plain="buttonType != 'text'"
          class="delete-btn"
          v-if="showOperation.indexOf('delete') >= 0"
        >
          删除
        </el-button>
      </template>
    </ty-table>
  </div>
</template>
<script>
/**
 * 组件名称 TyBusinessCrud
 * @desc 列表的增删改查
 * @author lyt
 * @date 2020年12月22日
 **/
import PcForm from "components/PcForm";
import TyTable from "components/TyTable";
import EditDialog from "./editDialog";
import componentsConfig from "components/FmDesign/src/json/componentsConfig";
import { getList, delRow } from "./api";
export default {
  name: "TyBusinessCrud",
  components: {
    EditDialog,
    TyTable,
    PcForm,
  },
  props: {
    // 查询表单域标签的后缀
    searchFormLabelSuffix: {
      type: String,
      default: ':'
    },
    //查询模式
    //default:默认模式--新建，操作按钮在查询后面
    //base:基础模式--新建，操作按钮换行显示
    //high：高级模式--带折叠查询
    searchMode: {
      type: String,
      default: "default",
    },
    //显示序号
    showIndex: {
      type: Boolean,
      default: true,
    },
    buttonType: {
      type: String,
      default: "primary",
    },
    buttonSize: {
      type: String,
      default: "mini",
    },
    //Table 的尺寸medium / small / mini
    size: {
      type: String,
      default: "medium",
    },
    //每个项目的分页信息不统一
    pageFormat: {
      type: Object,
      default: () => {
        return {
          pageNum: "pageNum",
          pageSize: "pageSize",
        };
      },
    },
    //分页信息
    pageInfo: {
      type: Object,
      default: () => {
        return {
          pageNo: 1,
          limit: 10,
          sizes: [5, 10, 20],
          total: 0,
        };
      },
    },
    //唯一标识,用于存储这个列表的配置，如显示搜索的字段
    mainKey: {
      type: String,
      default: "ty_dict_list",
    },
    //显示的功能列表
    showOperation: {
      type: Array,
      default: () => ["add", "delete", "update", "detail"],
    },
    //是否可以设置查询字段
    canSetsearchField: {
      type: Boolean,
      default: false,
    },
    //显示的查询的字段
    showSearchFields: {
      type: Array,
      default: () => ["dictName", "dictType"],
    },
    //列表主键
    id: {
      type: String,
      default: "dictId",
    },
    //标题
    title: {
      type: String,
      default: "数据字典",
    },
    //是否显示复选框
    showSelect: {
      type: Boolean,
      default: false,
    },
    //是否显示查询
    showSearch: {
      type: Boolean,
      default: true,
    },
    //字段
    columns: {
      type: Array,
      default: () => {
        return [
          {
            baseSearch: true,
            label: "字典名称", //字段名
            prop: "dictName", //字段key
            edit: true, //是否出现在新增修改
            formFormat: {}, //表单的数据对应表单设计器的数据
          },
          {
            label: "字典类型",
            prop: "dictType",
            edit: true,
          },
          {
            label: "状态",
            prop: "status",
            edit: true,
            formatter: (val) => {
              //格式化数据
              return val == 0 ? "正常" : "停用";
            },
            formFormat: {
              type: "select",
              icon: "icon-select",
              name: "下拉选择",
              options: {
                defaultValue: "",
                multiple: false,
                disabled: false,
                clearable: false,
                placeholder: "",
                required: false,
                showLabel: true,
                width: "",
                options: [
                  {
                    value: "1",
                    label: "停用",
                  },
                  {
                    value: "0",
                    label: "正常",
                  },
                ],
                filterable: false,
                optionDataType: 1,
                interfaceMethod: "",
                interfaceParam: "",
                interfaceId: "",
                tipFont: "",
                dictKey: "",
                props: {
                  value: "value",
                  label: "label",
                },
              },
              key: 1608804132000,
              model: "select_1608804132000",
              rules: [],
            },
          },
          {
            label: "备注",
            prop: "remark",
            edit: true,
          },
          {
            label: "创建时间",
            prop: "createTime",
            type: "datetime",
            edit: false,
            width: 200,
          },
          {
            prop: "operation",
            label: "操作",
            width: 200,
            type: "operation",
            fixed: "right",
            align: "right",
          },
        ];
      },
    },
    //删除方法
    delInterface: {
      type: Object,
      default: () => {
        return {
          url: "", //接口地址
          methodType: "", //接口请求类型
          resFormatFun: null, //删除接口参数格式化方法
        };
      },
    },
    //查询列表接口信息
    getListInterface: {
      type: Object,
      default: () => {
        return {
          url: "", //接口地址
          params: "", //传参数据
          methodType: "", //接口请求类型
          resFormatFun: null, //返回数据格式方法,返回包含list和total的对象
          timeout: 6e5, // 默认 10 分钟
        };
      },
    },
    //保存方法
    saveInterface: {
      type: Object,
      default: () => {
        return {
          params: "", //传参数据
          url: "", //接口地址
          methodType: "", //接口请求类型
        };
      },
    },
    //修改方法
    updateInterface: {
      type: Object,
      default: () => {
        return {
          params: "", //传参数据
          url: "", //接口地址
          methodType: "", //接口请求类型
        };
      },
    },
    // 是否隐藏分页
    hidePage: {
      type: Boolean,
      default: false,
    },
    // 是否显示更多形式的按钮
    showMoreOperator: {
      type: Boolean,
      default: false,
    },
    // 更多按钮选项
    btnOptions: {
      type: Array,
      default: () => [
        // {
        //   btnName: "导出",
        //   buttonType: "primary",
        //   buttonSize: "small",
        //   btnMethods: "",
        // },
      ],
    },
    // 是否居右
    alignRight: {
      type: Boolean,
      default: false,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    // 所有列文字居中方式
    allAlign: {
      type: String,
      default: "left",
    },
    // 默认的排序列的 prop 和顺序。它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
    defaultSort: {
      type: Object,
      default() {
        return {
          prop: '',
          order: ''
        }
      }
    },
    //搜索表单label的宽度
    labelWidth:{
      type: String | Number,
      default:100
    },
    //树形渲染嵌套数据的配置选项
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          hasChildren: 'hasChildren'
        };
      }
    },
    //是否懒加载子节点数据
    lazy: {
      type: Boolean,
      default: false
    },
    //加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息(Promise方法)
    loadTree: {
      type: Function
    },
    // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    //控制可以勾选复选框,方法需要返回true,或者false
    checkboxControl: {
      type: Function
    },
    /**
     * 控制合并单元格
     * 详见 {@link https://element.eleme.cn/#/zh-CN/component/table#he-bing-xing-huo-lie 合并行或列}
     * 方法的参数是一个对象，里面包含当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性。
     * 该函数可以返回一个包含两个元素的数组，第一个元素代表rowspan，第二个元素代表colspan。 
     * 也可以返回一个键名为rowspan和colspan的对象。
     * row, column, rowIndex, columnIndex
     */
    spanControl: {
      type: Function
    },
  },

  data() {
    let fields = this.showSearchFields || [];
    if (this.canSetsearchField) {
      const saveSearchField = JSON.parse(
        localStorage.getItem("tyBusinessCrud_set") || "{}"
      )["searchSet"];
      fields =
        (saveSearchField && saveSearchField[this.mainKey]) ||
        this.showSearchFields ||
        [];
    }
    return {
      searchHigh: false, //是否为高级搜索展开模式
      checkedSearchColumns: fields, //显示查询的字段,用来同步checkbox
      showSearchColumns: fields, //总的显示查询字段
      dialogVisible: false,
      selectedList: [], //复选框的选中的值包含分页
      editFormDisabled: false, //是否可以编辑表单
      searchFormKey: Date.parse(new Date()),
      searchFormData: {}, //搜索表单的值
      searchFormDataByBtn:{},//点击搜索按钮才去发起查询 --ylq 2022/11/18
      editObj: {}, //编辑表单的数据
      editDialogVisible: false, //修改或者新增
      checkTableRow: [], //复选框选中列表
      tableData: [], //列表数据
      page: this.getInitPageObj(), //分页对象
      showBtnList: false,
    };
  },
  provide() {
    return {
      crudObj: this,
    };
  },
  watch: {
    selectedList(val) {
      this.$emit("checkedChange", val);
    },
  },
  computed: {
    //搜索表单格式
    searchFormJsonData() {
      const formatList = [];
      let searchColumns = this.columns.filter(
        (item) => this.showSearchColumns.indexOf(item.prop) >= 0
      );
      //高级搜索模式
      if (this.searchMode == "high") {
        let base = searchColumns.filter((item) => item.baseSearch == true);
        let noBase = searchColumns.filter((item) => !item.baseSearch);
        searchColumns = base.concat(noBase);
        if (this.searchHigh == false) {
          searchColumns = base;
        }
      }
      console.log('pppp333', searchColumns)
      return {
        list: this.creatFormatFormFun(searchColumns, true),
        config: {
          id: "form_1591861099000",
          labelWidth: this.labelWidth,
          labelPosition: "right",
          size: "small",
          formName: "111",
        },
      };
    },
    //编辑表单的格式
    editFormData() {
      const editColumns = this.columns.filter((item) => item.edit == true);
      return this.creatFormatFormFun(editColumns);
    },
    //插槽字段
    slotColumns() {
      return this.columns.filter((item) => item.type == "slot");
    },
  },
  created() {
    this._getListData();
  },
  methods: {
    //获取搜索表单的值
    getSearchFormData() {
      // return this.searchFormData;
      //点击搜索按钮才去发起查询 --ylq 2022/11/18
      return this.searchFormDataByBtn;
    },
    //修改新增数据后操作
    refreshFun(res) {
      const { isAdd, data } = res;
      if (isAdd) {
        this.$emit("add", data);
      } else {
        this.$emit("update", data);
      }
      this._getListData();
    },
    //保存显示搜索的字段
    handleSearchColumnsChange() {
      const checkField = this.checkedSearchColumns;
      let setting = JSON.parse(
        localStorage.getItem("tyBusinessCrud_set") || "{}"
      );
      const obj = {
        [this.mainKey]: checkField,
      };
      setting["searchSet"] = obj;
      localStorage.setItem("tyBusinessCrud_set", JSON.stringify(setting));
      this.showSearchColumns = checkField;
      this.dialogVisible = false;
    },
    //查询设置
    searchSetFun() {
      this.dialogVisible = true;
    },
    //获取选中的列表项
    getCheckList() {
      return this.selectedList;
    },
    //设置选中的列表项
    setCheckList(list) {
      this.$refs.tableObj.changeRowSelection(list, this.id);
      this.$set(this, "selectedList", list);
      //this.selectedList = list;
    },
    //格式化表单
    creatFormatFormFun(columns, isSearch) {
      const formatList = [];
      columns.forEach((item) => {
        const { label, prop, formFormat = {} } = item;
        const formatType = (formFormat && formFormat.type) || "input";
        const configCom = componentsConfig.pc.base;
        const comFormatObj = configCom.find((o) => formatType == o.type);
        if (comFormatObj) {
          const thisObj = {
            ...comFormatObj,
            ...formFormat,
            name: label,
            key: prop,
            model: prop,
          };
          //设置宽度为100%
          if (this.searchMode == "high") {
            thisObj.options.width = "100%";
          } else {
            thisObj.options.width = "180px";
          }
          if (isSearch) {
            //查询不用有验证规则
            thisObj.rules = [];
          }
          formatList.push(thisObj);
        }
      });
      const { baseSearch } = this.$scopedSlots;
      let baseSearchNodes = [];
      if (baseSearch) {
        baseSearchNodes = this.$scopedSlots.baseSearch();
      }
      // console.log(baseSearchNodes)
      //高级搜索时查询三个元素插入搜索按钮
      if (this.searchMode == "high") {
        formatList.splice(2 - baseSearchNodes.length, 0, {
          type: "slot",
          icon: "icon-wenzishezhi-",
          name: "搜索按钮插槽",
          flag: 1,
          options: {
            width: "100%",
            slotName: "searchBtnSlot",
            defaultValue: "",
            required: false,
            validator: "",
            hideLabel: true,
          },
          key: 1619576911000,
          model: "slot_1619576911000",
          rules: [],
        });
      }
      return formatList;
    },
    // 复选框选择
    handleSelectionChange(val) {
      this.checkTableRow = val;
      this.$emit('selectionChange', val);
    },
    //删掉此项数据
    deleteCheckRow(item) {
      this.checkTableRow = this.checkTableRow.filter(
        (obj) => obj[this.id] != item[this.id]
      );
      this.$refs.tableObj.changeRowSelection(this.checkTableRow);
    },
    // 获取初始化分页对象
    getInitPageObj() {
      const page = Object.assign(
        {
          pageNo: 1,
          limit: 10,
          sizes: [5, 10, 20],
          total: 0,
        },
        this.pageInfo
      );
      return page;
    },
    // 重置查询
    resetSearch() {
      this.$set(this, "selectedList", []);
      this.searchFormKey = Date.parse(new Date());
      this.searchFormData = {};
      //点击搜索按钮才去发起查询 --ylq 2022/11/18
      this.searchFormDataByBtn={}
      this.page = this.getInitPageObj();
      this.$emit("resetSearch");
      this.searchHigh = false;
      this._getListData();
      this.$emit("highSearchChange", this.searchHigh);
    },
    // 查询
    searchFun() {
      this.$set(this, "selectedList", []);
      this.page = this.getInitPageObj();
      //点击搜索按钮才去发起查询 --ylq 2022/11/18
      this.searchFormDataByBtn=this.searchFormData
      this.$emit("search");
      this.searchHigh = false;
      this._getListData();
      this.$emit("highSearchChange", this.searchHigh);
    },
    // 查询列表
    _getListData(isSearch) {
      //页数，页码
      const { pageNo, limit } = this.page;
      let postData = {
        [this.pageFormat["pageNum"] || "pageNum"]: pageNo,
        [this.pageFormat["pageSize"] || "pageSize"]: limit,
        // ...this.searchFormData,
        ...this.searchFormDataByBtn
      };
      const { params, resFormatFun } = this.getListInterface;
      if (params) {
        postData = {
          ...params,
          ...postData,
        };
      }
      getList(postData, this.getListInterface).then((res) => {
        let list = [];
        let pageTotal = 0;
        if (resFormatFun) {
          const formatObj = resFormatFun(res);
          list = formatObj.list;
          pageTotal = formatObj.total;
        } else {
          list = res.data.records;
          pageTotal = res.data.total;
        }
        this.tableData = list;
        this.page.total = pageTotal;
        //数据为空并且总页数大于一页的数据是进行上一页处理
        let { limit, total, pageNo } = this.page;
        if (this.tableData && this.tableData.length == 0 && total >= limit) {
          this.handleCurrentChange(pageNo - 1 <= 0 ? 1 : pageNo - 1);
        }
      });
    },
    // 改变页面大小处理
    handleSizeChange(val) {
      this.page.limit = val;
      let pageSize = Math.ceil(this.page.total / val);
      if (this.page.pageNo > pageSize) {
        //如果当前页数超过页面总数，则会触发翻页方法，不需要再进行多次列表接口请求
        return;
      }
      this._getListData();
    },
    // 翻页处理
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this._getListData();
    },
    // 删除
    delectRow(row) {
      this.$confirm("确定删除此数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let parmasObj = {
            [this.id]: row[[this.id]],
          };
          const { resFormatFun } = this.delInterface;
          if (resFormatFun) {
            parmasObj = resFormatFun(row);
          }
          delRow(parmasObj, this.delInterface).then((res) => {
            this.$message.success("删除成功!");
            this.$emit("delete", row[[this.id]]);
            this._getListData();
          });
        })
        .catch(() => {});
    },
    //新建/修改
    editFun(row, editDisabled) {
      if (row) {
        this.editObj = row;
      } else {
        this.editObj = {};
      }
      this.editDialogVisible = true;
      this.editFormDisabled = !!editDisabled;
    },
    //切换高级搜索模式
    searchHighFun() {
      this.searchHigh = !this.searchHigh;
      this.$emit("highSearchChange", this.searchHigh);
    },
    //选择复选框
    handleSelectFun(selectObj) {
      this.$emit("select", selectObj);
    },

    // 显示更多里面的按钮列表
    showMore() {
      this.showBtnList = !this.showBtnList;
    },
    /**
     * 当表格的排序条件发生变化的时候会触发该事件
     * @param {Object} event 事件对象
     * @param {Object[]} event.column 表格列数据
     * @param {string} event.prop 属性名
     * @param {string} event.order 顺序
     */
    handleSortChage(event) {
      this.$emit('sort-change', event)
    },
   // 回车键进行查询  -- 2022.09.08 - by hjm
    goSearch(){
    this.searchFun();
   },
  },
};
</script>
<style
  lang="scss"
  scoped
>
$primaryColor-ie: #409eff !default;
$primaryColor: #409eff !default;

.searchBox-high-operator-bar {
  padding: 10px 0 20px;
}

.searchBox-high {
  display: flex;
  padding: 20px 0 0;

  /* overflow-x: auto; */
  .searchBox-btn {
    .high-link {
      margin-left: 10px;

      &::after {
        display: none;
      }
    }
  }

  .searchBox-form {
    flex: 1;
    min-width: 700px;

    ::v-deep .el-form {
      width: 100%;
      text-align: center;
      display: flex;
      align-content: flex-start;
      flex-flow: row wrap;

      .el-form-item {
        text-align: left;
        flex: 0 0 33%;
        margin-bottom: 20px;
        padding-right: 30px;
        box-sizing: border-box;
      }

      .search-item {
        .el-form-item__label {
          float: left;
          line-height: 36px;
          font-size: 14px;
          color: #606266;
          text-align: right;
          padding: 0 12px 0 0;
          box-sizing: border-box;
        }

        .search-item-ctn,
        .el-form-item__content {
          margin-left: 100px;
          text-align: left;
          line-height: 32px;
          /* margin-left: 0 !important; */
        }
      }
    }
  }
}

.searchBox {
  padding: 20px 0 0;
  ::v-deep label {
    font-size: 14px;
    color: #666;
  }

  .line {
    height: 20px;
    width: 2px;
    background: #ccc;
    display: inline-block;
    vertical-align: middle;
    margin: 10px 10px;
  }

  display: flex;
  flex-wrap: wrap;

  .searchBox-form {
    flex: 1;
  }

  ::v-deep .el-form {
    width: 100%;
    text-align: center;
    display: flex;
    align-content: flex-start;
    flex-flow: row wrap;

    .el-form-item {
      text-align: left;
      /* flex: 0 0 30%; */
      margin-bottom: 20px;
      padding-right: 30px;
      box-sizing: border-box;
    }

    .search-item {
      .el-form-item__label {
        float: left;
        line-height: 36px;
        font-size: 14px;
        color: #606266;
        text-align: right;
        width: 100px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
      }

      .search-item-ctn,
      .el-form-item__content {
        margin-left: 100px;
        text-align: left;
        line-height: 32px;
        /* margin-left: 0 !important; */
      }
    }

    .searchBox-btn {
      margin-bottom: 20px;
    }

    .el-radio-group {
      margin-top: -10px;
    }
  }
}


.ty-business-crud__title {
  font-size: 20px;
  font-weight: bold;
  color: rgba(29, 29, 30, 1);
  line-height: 38px;
  position: relative;
  padding-left: 16px;
  margin-right: 30px;

  &::before {
    position: absolute;
    left: 0;
    top: 7px;
    content: "";
    width: 6px;
    height: 24px;
    background-color: $primaryColor-ie;
    background-color: $primaryColor;
  }
}

::v-deep .el-button.delete-btn {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}

::v-deep .el-button--text.delete-btn {
  color: #f56c6c;
  background: none;
  border-color: transparent;
}

::v-deep .searchBox-form {
  .el-form-item {
    .el-form-item__label,
    label {
      padding: 7px 12px 0 0 !important;
      line-height: 18px !important;
      overflow: hidden;
      max-height: 40px;
      font-weight: normal;
    }
  }
}
.more {
  position: relative;
  text-align: right;
  margin-left: 20px;
  &-btn {
    list-style: none;
    border: solid 1px #dcdcdc;
    position: absolute;
    top: 20px;
    right: 0;
    z-index: 999;
    background: #fff;
    padding: 10px;
    border-radius: 2px;
    &-li {
      margin: 5px;
    }
  }
}

.align-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.default-more,
.base-more {
  margin-bottom: 20px;
}

.more-btn-item {
  width: 100px;
}
</style>
