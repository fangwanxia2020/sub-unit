<template>
  <div style="width:1900px;height:800px;">
    <!-- {{aa1}}
    <ty-cascader
      width="300px"
      :actionParams="{isDefault:0}"
      v-model="aa1"
    ></ty-cascader>
    {{aa2}}
    <ty-cascader
      :options="options"
      width="300px"
      v-model="aa2"
      :remote="false"
    ></ty-cascader>
    {{aa3}}
    <ty-cascader
      width="300px"
      v-model="aa3"
      :actionParams="{isDefault:0,pageSize: 2000,parentId:0}"
      :remote="true"
      :lazyLoad="false"
    ></ty-cascader>
    <ty-icon type="wechat"></ty-icon>
    <ty-icon
      type="alipay"
      size="80"
    ></ty-icon>
    <ty-icon type="openEye"></ty-icon> -->
    <ty-table
      ref="tableObj"
      :stripe="false"
      :rowClassNameControl="rowClassNameControl"
      :columns="columns"
      :data="tableData"
      :pager="page"
      :showSelect="false"
      :lazy="false"
      :loadTree="loadTree"
      :checkboxControl="checkboxControl"
    >
      <template v-slot:label-product>
        <div style="display:flex;">
          <span style="flex:1;">产品名称</span>
          <span style="width:80px">数量</span>
          <span style="width:80px">价格</span>
        </div>
      </template>
      <template v-slot:product="{data}">
        <div
          style="display:flex;border-bottom:1px solid #EBEEF5;margin:0 -10px;"
          v-for="(item,index) in data.product"
          :key="index"
        >
          <span style="flex:1;">{{item.name}}</span>
          <span style="width:80px">{{item.number}}</span>
          <span style="width:80px">{{item.price}}</span>
        </div>
      </template>
      <template v-slot:expand="{data}"> sdsd{{data.id}} </template>
    </ty-table>
    <!-- :spanControl="objectSpanMethod"
      
       <span @click="getTextFun">{{area}}</span>
    <ty-select-area
      v-model="area"
      ref="areaObj"
    ></ty-select-area>
    <ty-checkbox
      :isAllValue="true"
      :remote="true"
      v-model="selectVal1"
      :optItem="{ value:'dictValue', label:'dictLabel' }"
      :interfaceParam="{dictType:'sys_tenant_type'}"
    >
    </ty-checkbox>
    {{selectVal1}}
    <ty-dictionary
      width="180px"
      :actionParams="{dictType:'sys_tenant_type'}"
      v-model="selectVal1"
      :isAllValue="true"
      :multiple="true"
    ></ty-dictionary> -->
    <fm-design
      :key="iid"
      :businessComponent="businessComponent"
    ></fm-design>
  </div>
</template>
<script>
export default {
  name: "design",
  components: {},
  data() {
    const coms = [{
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
        slotName: "EnterpriseIntroduce"
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
        slotName: "EnterpriseIntroduce"
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
        slotName: "EnterpriseIntroduce"
      }
    }];
    return {
      aa3: [],
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, ]
        }]
      }],
      aa1: [],
      aa2: [{
        "label": "指南",
        "value": "zhinan"
      }, {
        "label": "设计原则",
        "value": "shejiyuanze"
      }, {
        "label": "一致",
        "value": "yizhi"
      }],
      columns: [{
        prop: "product",
        labelSlot: true,
        type: "slot",
        width: "380"
      }, {
        prop: "date",
        label: "时间"
      }, {
        prop: "address",
        label: "地址"
      }],
      tableData: [{
        date: '2016-05-02',
        id: '1',
        product: [{
          name: '111',
          price: 10,
          number: 1
        }, {
          name: '222',
          price: 10,
          number: 1
        }],
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-04',
        id: '2',
        product: [{
          name: '111',
          price: 10,
          number: 1
        }, {
          name: '222',
          price: 10,
          number: 1
        }],
        address: '上海市普陀区金沙江路 1517 弄',
        hasChildren: true
      }, {
        date: '2016-05-01',
        id: '3',
        product: [{
          name: '111',
          price: 10,
          number: 1
        }, {
          name: '222',
          price: 10,
          number: 1
        }],
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        id: '4',
        product: [{
          name: '111',
          price: 10,
          number: 1
        }, {
          name: '222',
          price: 10,
          number: 1
        }],
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      page: {
        pageNo: 1,
        limit: 5,
        sizes: [5, 10, 20],
        total: 4
      },
      area: [],
      iid: "",
      businessComponent: {
        pc: coms,
        mobile: []
      },
      templateJson: {},
      selectVal1: [{
        "label": "平台",
        "value": "admin"
      }, {
        "label": "供应商",
        "value": "supplier"
      }, {
        "label": "代理机构",
        "value": "agent"
      }, {
        "label": "采购人",
        "value": "procurer"
      }]
    }
  },
  created() {
    // setTimeout(() => {
    //   this.iid = new Date().getTime();
    //   this.templateJson = {
    //     "list": [{
    //       "type": "input",
    //       "icon": "icon-input",
    //       "name": "单行文本",
    //       "options": {
    //         "showText": false,
    //         "width": "100%",
    //         "defaultValue": "",
    //         "required": false,
    //         "dataType": "string",
    //         "maxlength": "",
    //         "minlength": "",
    //         "validator": "",
    //         "pattern": "",
    //         "patternTips": "",
    //         "placeholder": "",
    //         "disabled": false,
    //         "hide": false,
    //         "tipFont": "",
    //         "mouseTips": ""
    //       },
    //       "key": 1606962281000,
    //       "model": "input_1606962281000",
    //       "rules": [{
    //         "type": "string",
    //         "message": "请输入字符串类型数据"
    //       }]
    //     }, {
    //       "type": "textarea",
    //       "icon": "icon-diy-com-textarea",
    //       "name": "多行文本",
    //       "options": {
    //         "width": "100%",
    //         "defaultValue": "",
    //         "row": 2,
    //         "required": false,
    //         "disabled": false,
    //         "pattern": "",
    //         "maxlength": "",
    //         "minlength": "",
    //         "patternTips": "",
    //         "tipFont": "",
    //         "placeholder": ""
    //       },
    //       "key": 1606962282000,
    //       "model": "textarea_1606962282000",
    //       "rules": []
    //     }],
    //     "config": {
    //       "id": "form_1606383079000",
    //       "labelWidth": 100,
    //       "labelPosition": "right",
    //       "size": "medium",
    //       "formName": "模板表单"
    //     }
    //   };
    // }, 1000);
  },
  watch: {},
  methods: {
    rowClassNameControl({
      row,
      rowIndex
    }) {
      if (rowIndex == 0) {
        return "ggg"
      }
      return "";
    },
    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        }
        else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    loadTree() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          if (true) {
            console.log('resolve console1')
            resolve([{
              id: 31,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              id: 32,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }])
          }
          else {
            reject('reject return1')
          }
        }, 2000)
      })
    },
    checkboxControl(row, index) {
      if (row.id == '2' || row.id == '3') {
        return false;
      }
      else {
        return true;
      }
    },
    getTextFun() {
      alert(this.$refs.areaObj.getText());
    }
  }
};

</script>
<style
  scoped
  lang="less"
>
</style>
