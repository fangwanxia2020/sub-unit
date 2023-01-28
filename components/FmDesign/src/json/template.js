const list = [
  {
    name: "会员申请模板",
    template: {
      "list": [{
        "type": "title",
        "icon": "icon-wenzishezhi-",
        "name": "基础信息",
        "options": {
          "width": "100%",
          "defaultValue": ""
        },
        "key": 1605682032000,
        "model": "title_1605682032000",
        "rules": []
      },{
        "type": "grid",
        "icon": "icon-grid-",
        "name": "栅格布局",
        "columns": [{
          "span": 8,
          "list": [{
            "type": "input",
            "icon": "icon-input",
            "name": "单位名称",
            "options": {
              "showText": false,
              "width": "100%",
              "defaultValue": "",
              "required": false,
              "dataType": "string",
              "maxlength": "",
              "minlength": "",
              "pattern": "",
              "patternTips": "",
              "placeholder": "",
              "disabled": false,
              "hide": false,
              "tipFont": "",
              "mouseTips": ""
            },
            "key": "1605681527000_95759",
            "model": "unitName",
            "rules": [{
              "type": "string",
              "message": "请输入字符串类型数据"
            }]
          }]
        },{
          "span": 8,
          "list": [{
            "type": "input",
            "icon": "icon-input",
            "name": "地址",
            "options": {
              "showText": false,
              "width": "100%",
              "defaultValue": "",
              "required": false,
              "dataType": "string",
              "maxlength": "",
              "minlength": "",
              "pattern": "",
              "patternTips": "",
              "placeholder": "",
              "disabled": false,
              "hide": false,
              "tipFont": "",
              "mouseTips": ""
            },
            "key": "1605681602000_68874",
            "model": "address",
            "rules": []
          }]
        },{
          "span": 8,
          "list": [{
            "type": "input",
            "icon": "icon-input",
            "name": "公司电话",
            "options": {
              "showText": false,
              "width": "100%",
              "defaultValue": "",
              "required": false,
              "dataType": "string",
              "maxlength": "",
              "minlength": "",
              "pattern": "",
              "patternTips": "",
              "placeholder": "",
              "disabled": false,
              "hide": false,
              "tipFont": "",
              "mouseTips": ""
            },
            "key": "1605681628000_38181",
            "model": "phoneNumber",
            "rules": []
          }]
        }],
        "options": {
          "gutter": 0,
          "justify": "start",
          "align": "top"
        },
        "key": 1605681497000,
        "model": "grid_1605681497000",
        "rules": []
      },{
        "type": "grid",
        "icon": "icon-grid-",
        "name": "栅格布局",
        "columns": [{
          "span": 8,
          "list": [{
            "type": "input",
            "icon": "icon-input",
            "name": "法人",
            "options": {
              "showText": false,
              "width": "100%",
              "defaultValue": "",
              "required": false,
              "dataType": "string",
              "maxlength": "",
              "minlength": "",
              "pattern": "",
              "patternTips": "",
              "placeholder": "",
              "disabled": false,
              "hide": false,
              "tipFont": "",
              "mouseTips": ""
            },
            "key": "1605681728000_70058",
            "model": "legal",
            "rules": [{
              "type": "string",
              "message": "请输入字符串类型数据"
            }]
          }]
        },{
          "span": 8,
          "list": [{
            "type": "input",
            "icon": "icon-input",
            "name": "法人身份证号",
            "options": {
              "showText": false,
              "width": "100%",
              "defaultValue": "",
              "required": false,
              "dataType": "string",
              "maxlength": "",
              "minlength": "",
              "pattern": "",
              "patternTips": "",
              "placeholder": "",
              "disabled": false,
              "hide": false,
              "tipFont": "",
              "mouseTips": ""
            },
            "key": "1605681766000_15990",
            "model": "idCardNumber",
            "rules": [{
              "type": "string",
              "message": "请输入字符串类型数据"
            }]
          }]
        },{
          "span": 8,
          "list": []
        }],
        "options": {
          "gutter": 0,
          "justify": "start",
          "align": "top"
        },
        "key": 1605681711000,
        "model": "grid_1605681711000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-card",
        "name": "身份证照片",
        "component": true,
        "options": {
          "width": "100%",
          "defaultValue": "",
          "slotName": "IdCardPhone"
        },
        "key": 1605690719000,
        "model": "slot_1605690719000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-card",
        "name": "证件",
        "component": true,
        "options": {
          "width": "100%",
          "defaultValue": "",
          "slotName": "Card"
        },
        "key": 1605690727000,
        "model": "slot_1605690727000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-card",
        "name": "会员等级及费用",
        "component": true,
        "options": {
          "width": "100%",
          "defaultValue": "",
          "slotName": "MemberGrade"
        },
        "key": 1605690733000,
        "model": "slot_1605690733000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-card",
        "name": "企业介绍",
        "component": true,
        "options": {
          "width": "100%",
          "defaultValue": "",
          "slotName": "EnterpriseIntroduce"
        },
        "key": 1605690743000,
        "model": "slot_1605690743000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-card",
        "name": "服务能力",
        "component": true,
        "options": {
          "width": "100%",
          "defaultValue": "",
          "slotName": "ServiceCapability"
        },
        "key": 1605690749000,
        "model": "slot_1605690749000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-card",
        "name": "联系人",
        "component": true,
        "options": {
          "width": "100%",
          "defaultValue": "",
          "slotName": "EnterpriseIntroduce"
        },
        "key": 1605690751000,
        "model": "slot_1605690751000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-card",
        "name": "系统用户",
        "component": true,
        "options": {
          "width": "100%",
          "defaultValue": "",
          "slotName": "EnterpriseIntroduce"
        },
        "key": 1605690753000,
        "model": "slot_1605690753000",
        "rules": []
      }],
      "config": {
        "id": "form_1605681470000",
        "labelWidth": 180,
        "labelPosition": "right",
        "size": "medium",
        "formName": "pc端表单"
      }
    }
  },
  {
    name: "用户信息表",
    template: { "list": [{ "type": "text","icon": "icon-wenzishezhi-","name": "","options": { "width": "100%","defaultValue": "<h1 class=\"ql-align-center\">用户信息</h1>" },"key": 1588927538000,"model": "text_1588927538000","rules": [] },{ "type": "input","icon": "icon-input","name": "姓名","options": { "width": "100%","defaultValue": "","required": false,"dataType": "string","maxlength": "","minlength": "","pattern": "","patternTips": "","placeholder": "","disabled": false,"hide": false,"mouseTips": "" },"key": 1588928169000,"model": "input_1588928169000","rules": [{ "type": "string","message": "请输入字符串类型数据" }] },{ "type": "radio","icon": "icon-radio-active","name": "性别","options": { "inline": true,"defaultValue": "选项2","showLabel": true,"options": [{ "value": "man","label": "男" },{ "value": "woman","label": "女" }],"required": false,"width": "","optionDataType": 1,"interfaceMethod": "","interfaceParam": "","interfaceId": "","dictKey": "","props": { "value": "value","label": "label" },"disabled": false },"key": 1588928175000,"model": "radio_1588928175000","rules": [] },{ "type": "textarea","icon": "icon-diy-com-textarea","name": "性趣爱好","options": { "width": "100%","defaultValue": "","row": 2,"required": false,"disabled": false,"pattern": "","maxlength": "","minlength": "","patternTips": "","placeholder": "" },"key": 1588928229000,"model": "textarea_1588928229000","rules": [] }],"config": { "id": "form_1588927526000","labelWidth": 100,"labelPosition": "right","size": "small","formName": "111" } }
  },
  {
    name: "意见表",
    template: { "list": [{ "type": "text","icon": "icon-wenzishezhi-","name": "","options": { "width": "100%","defaultValue": "<h1 class=\"ql-align-center\">意见表</h1>" },"key": 1588927538000,"model": "text_1588927538000","rules": [] },{ "type": "input","icon": "icon-input","name": "姓名","options": { "width": "100%","defaultValue": "","required": false,"dataType": "string","maxlength": "","minlength": "","pattern": "","patternTips": "","placeholder": "","disabled": false,"hide": false,"mouseTips": "" },"key": 1588928093000,"model": "input_1588928093000","rules": [{ "type": "string","message": "请输入字符串类型数据" }] },{ "type": "textarea","icon": "icon-diy-com-textarea","name": "意见","options": { "width": "100%","defaultValue": "","row": 2,"required": false,"disabled": false,"pattern": "","maxlength": "","minlength": "","patternTips": "","placeholder": "" },"key": 1588928103000,"model": "textarea_1588928103000","rules": [] }],"config": { "id": "form_1588927526000","labelWidth": 100,"labelPosition": "right","size": "medium","formName": "111" } }
  },
]
export default list;
