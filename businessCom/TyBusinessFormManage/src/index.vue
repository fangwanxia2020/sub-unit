<template>
  <div class="ty-business-form-manage">
    <template v-if="!(showType)">
      <ty-business-crud
        :canSetsearchField="false"
        :pageInfo="pageInfo"
        :pageFormat="pageFormat"
        :size="size"
        :title="title"
        :showSearchFields="showSearchFields"
        :buttonType="buttonType"
        :buttonSize="buttonSize"
        :showOperation="['delete']"
        :columns="columns"
        :getListInterface="getListInterface"
        :delInterface="delInterfaceCpd"
        :id="id"
        :showSearch="showSearch"
        ref="formManageCrud"
      >
        <span
          slot="operator"
          style="margin-left:10px;border-left:1px solid #ddd;padding-left:10px;"
        >
          <el-button
            type="primary"
            @click="goEditFun"
          >新建</el-button>
        </span>
        <template v-slot:rowOperator="scope">
          <slot
            name="rowOperator"
            v-bind:row="scope.row"
          ></slot>
          <el-button
            :type="buttonType"
            :size="buttonSize"
            :plain="buttonType!='text'"
            @click="goEditFun(scope.row)"
          >编辑</el-button>
        </template>
      </ty-business-crud>
    </template>
    <!-- 模板管理--添加修改-->
    <template v-if="(showType)=='edit'">
      <form-edit>
        <slot name="editForm">
        </slot>
      </form-edit>
    </template>
  </div>
</template>
<script>
/**
 * 组件名称 TyBusinessFormManage
 * @desc 表单模板管理
 * @author lyt
 * @date 2020年2月24日
 **/
import TyBusinessCrud from "businessCom/TyBusinessCrud";
import FormEdit from "./edit";
export default {
  name: "TyBusinessFormManage",
  components: {
    TyBusinessCrud,
    FormEdit
  },
  props: {
    //按钮的类型
    buttonType: {
      type: String,
      default: "text"
    },
    buttonSize: {
      type: String,
      default: "mini"
    },
    //Table 的尺寸medium / small / mini
    size: {
      type: String,
      default: "medium"
    },
    //每个项目的分页信息不统一
    pageFormat: {
      type: Object,
      default: () => {
        return {
          pageNum: 'pageNum',
          pageSize: 'pageSize',
        }
      }
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
        }
      }
    },
    //是否显示查询
    showSearch: {
      type: Boolean,
      default: true
    },
    //显示的查询的字段
    showSearchFields: {
      type: Array,
      default: () => ["applytemplateName"]
    },
    //列表主键
    id: {
      type: String,
      default: "applytemplateId"
    },
    //标题
    title: {
      type: String,
      default: "模板管理"
    },
    //字段
    columns: {
      type: Array,
      default: () => {
        return [{
          label: "模板名称",
          prop: "applytemplateName"
        }, {
          label: "性质",
          prop: "applytemplateNature",
          formatter: val => {
            return val == 0 ? "单位" : "个人";
          }
        }, {
          label: "类型",
          prop: "applytemplateTypename"
        }, {
          label: "创建时间",
          prop: "createTime",
          type: "datetime",
          width: 200,
        }, {
          label: "更新时间",
          prop: "updateTime",
          type: "datetime",
          width: 200,
        }, {
          prop: "operation",
          label: "操作",
          width: 200,
          type: "operation",
          fixed: "right",
        }]
      }
    },
    //删除方法
    delInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/remove", //接口地址
          methodType: "post", //接口请求类型
          resFormatFun: null
        }
      }
    },
    //查询详情接口信息
    getDetailInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/getInfo", //接口地址         
          methodType: "get", //接口请求类型
          paramsFormatFun: null,
          resFormatFun: null
        }
      }
    },
    //查询列表接口信息
    getListInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/list", //接口地址         
          methodType: "get", //接口请求类型
          params: "", //传参数据
          resFormatFun: null, //返回数据格式方法,返回包含list和total的对象
        }
      }
    },
    //保存方法
    saveInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/add", //接口地址
          methodType: "post", //接口请求类型
          dataFormatFun: null, //格式化数据方法
        }
      }
    },
    //修改方法
    updateInterface: {
      type: Object,
      default: () => {
        return {
          url: "http://192.168.1.147:9547/yanxue-association-server/association/applytemplate/edit", //接口地址
          methodType: "post", //接口请求类型
          dataFormatFun: null, //格式化数据方法
        }
      }
    },
    //是否显示表单模板属性值表单
    showformConfig: {
      type: Boolean,
      default: true
    },
    //业务组件定义
    businessComponent: {
      type: Array,
      default: () => {
        return [{
          type: 'slot',
          icon: 'icon-card',
          name: '服务能力',
          component: true,
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            validator: '',
            slotName: "ServiceCapability"
          }
        }, {
          type: 'slot',
          icon: 'icon-card',
          name: '身份证照片',
          component: true,
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            validator: '',
            slotName: "IdCardPhone"
          }
        }, {
          type: 'slot',
          icon: 'icon-card',
          name: '证件',
          component: true,
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            validator: '',
            slotName: "Card"
          }
        }, {
          type: 'slot',
          icon: 'icon-card',
          name: '会员等级及费用',
          component: true,
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            validator: '',
            slotName: "MemberGrade"
          }
        }, {
          type: 'slot',
          icon: 'icon-card',
          name: '企业介绍',
          component: true,
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            validator: '',
            slotName: "EnterpriseIntroduction"
          }
        }, {
          type: 'slot',
          icon: 'icon-card',
          name: '联系人',
          component: true,
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            validator: '',
            slotName: "Contacts"
          }
        }, {
          type: 'slot',
          icon: 'icon-card',
          name: '系统用户',
          component: true,
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            validator: '',
            slotName: "SystemUser"
          }
        }]
      }
    },
  },
  provide() {
    return {
      formManage: this
    }
  },
  data() {
    return {};
  },
  watch: {
    '$route': {
      handler: function(val) {},
      immediate: true
    }
  },
  computed: {
    showType() {
      const routeObj = this.$route;
      return routeObj && (routeObj.query.type);
    },
    delInterfaceCpd() {
      const {
        resFormatFun
      } = this.delInterface || {};
      return {
        ...this.delInterface,
        resFormatFun: resFormatFun ? resFormatFun : this.delResFormatFun
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    delResFormatFun(res) {
      return res[this.id];
    },
    // 修改/新增
    goEditFun(row) {
      this.$emit("goEdit", row);
      this.$router.push({
        path: this.$route.path + "?type=edit",
        query: {
          id: (row || {})[this.id]
        },
      });
    },
    getList() {
      this.$refs.formManageCrud._getListData();
    }
  }
};

</script>
<style
  lang="scss"
  scoped
>
</style>
