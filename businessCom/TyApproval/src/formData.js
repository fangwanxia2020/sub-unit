export const getFormData = (formVal,isDetail) => {

  const formData = {
    "list": [
      {
        "type": "title",
        "flag": 0,
        "icon": "icon-wenzishezhi-",
        "name": "审批信息",
        "options": {
          "width": "100%",
          "defaultValue": "",
          hide: isDetail
        },
        "key": 1615363246000,
        "model": "title_1615363246000",
        "rules": []
      },{
        "type": "radio",
        "icon": "icon-radio-active",
        "name": "审批结果",
        "flag": 0,
        "options": {
          hide: isDetail,
          "borderRadius": "no",
          "inline": true,
          "defaultValue": "1",
          "showLabel": true,
          "options": [{
            "value": 1,
            "label": "审批通过"
          }, {
            "value": 0,
            "label": "审批不通过"
          }],
          "required": true,
          "width": "",
          "optionDataType": 1,
          "interfaceMethod": "/basic/SysDictData/getChildrenItemsByDictType",
          "interfaceParam": "{\"dictType\":\"sys_tenant_type\"}",
          "interfaceId": 1615363258000,
          "resList": "data.records",
          "interfaceType": "get",
          "tipFont": "",
          "dictKey": "",
          "props": {
            "value": "dictValue",
            "label": "dictLabel"
          },
          "disabled": false
        },
        "key": "approvalFlag",
        "model": "approvalFlag",
        "rules": [{
          "required": true,
          "message": "审批结果不能为空"
        }]
      },{
        "type": "textarea",
        "icon": "icon-diy-com-textarea",
        "name": "审批意见",
        "flag": 0,
        "options": {
          hide: isDetail,
          "borderRadius": "no",
          "width": "500px",
          "defaultValue": "同意",
          "row": 2,
          "required": true,
          "disabled": false,
          "pattern": "",
          "minlength": "",
          "patternTips": "",
          "tipFont": "",
          "maxlength": "140",
          "placeholder": "",
          "interfaceId": 1615363308000
        },
        "key": "comment",
        "model": "comment",
        "rules": [{
          "required": true,
          "message": "审批意见不能为空"
        }]
      },{
        "type": "title",
        "flag": 0,
        "icon": "icon-wenzishezhi-",
        "name": "审批记录",
        "options": {
          "width": "100%",
          "defaultValue": ""
        },
        "key": 1615363342000,
        "model": "title_1615363342000",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-wenzishezhi-",
        "name": "自定义插槽",
        "flag": 1,
        "options": {
          "width": "100%",
          "slotName": "tableRecord",
          "defaultValue": "",
          "required": false,
          "validator": "",
          "hideLabel": true
        },
        "key": 1615363354000,
        "model": "slot_1615363354000",
        "rules": []
      },
      {
        "type": "title",
        "flag": 0,
        "icon": "icon-wenzishezhi-",
        "name": "审批流",
        "options": {
          "width": "100%",
          "defaultValue": ""
        },
        "key": 1615363342001,
        "model": "title_1615363342001",
        "rules": []
      },{
        "type": "slot",
        "icon": "icon-wenzishezhi-",
        "name": "自定义插槽",
        "flag": 1,
        "options": {
          "width": "100%",
          "slotName": "approvalFlow",
          "defaultValue": "",
          "required": false,
          "validator": "",
          "hideLabel": true
        },
        "key": 1615363354002,
        "model": "slot_1615363354002",
        "rules": []
      }],
    "config": {
      "id": "form_1615363241000",
      "labelWidth": 130,
      "labelPosition": "right",
      "size": "medium",
      "column": "column",
      "formName": "表单组件"
    }
  }

    ;
  return formData;
}
