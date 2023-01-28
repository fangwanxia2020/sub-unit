//flag:0(pc和mobile共有)，1（pc）,2(mobile)
const pcComponents = {
  base: [
    {
      type: 'title',
      flag: 0,
      icon: 'icon-wenzishezhi-',
      name: '标题',
      options: {
        width: '100%',
        defaultValue: ''
      }
    },
    {
      type: 'slot',
      icon: 'icon-wenzishezhi-',
      name: '自定义插槽',
      flag: 1,
      options: {
        width: '100%',
        slotName: 'slotName',
        defaultValue: '',
        required: false,
        validator: '',
        hideLabel: false
      }
    },{
      type: 'text',
      icon: 'icon-wenzishezhi-',
      name: '文本描述',
      flag: 1,
      options: {
        width: '100%',
        defaultValue: '',
        hideLabel: false
      }
    },
    {
      type: 'input',
      icon: 'icon-input',
      name: '单行文本',
      flag: 0,
      options: {
        clearable: false,
        showText: false,
        width: '100%',
        defaultValue: '',
        required: false,
        dataType: 'string',
        maxlength: '',
        minlength: '',
        validator: '',
        pattern: '',
        patternTips: '',
        placeholder: '',
        disabled: false,
        hide: false,
        showText: false,
        tipFont: '',
        mouseTips: '',
        borderRadius: 'no',
      }
    },
    {
      type: 'password',
      icon: 'icon-password',
      name: '密码框',
      flag: 0,
      options: {
        clearable: false,
        borderRadius: 'no',
        width: '100%',
        defaultValue: '',
        required: false,
        dataType: 'string',
        maxlength: '',
        minlength: '',
        pattern: '',
        patternTips: '',
        placeholder: '',
        disabled: false,
        hide: false,
        tipFont: '',
        mouseTips: ''
      }
    },
    {
      type: 'textarea',
      icon: 'icon-diy-com-textarea',
      name: '多行文本',
      flag: 0,
      options: {
        borderRadius: 'no',
        width: '100%',
        defaultValue: '',
        row: 2,
        required: false,
        disabled: false,
        pattern: '',
        minlength: '',
        patternTips: '',
        tipFont: '',
        maxlength: "140",
        placeholder: ''
      }
    },
    {
      type: 'radio',
      icon: 'icon-radio-active',
      name: '单选框',
      flag: 0,
      options: {
        borderRadius: 'no',
        inline: false,
        defaultValue: null,
        showLabel: false,
        options: [{
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项2',
          label: '选项2'
        },
        {
          value: '选项3',
          label: '选项3'
        }
        ],
        required: false,
        width: '',
        optionDataType: 1,
        interfaceMethod: '/system/SysDictData/getChildrenItemsByDictType',
        interfaceParam: '{"dictType":"sys_tenant_type"}',
        interfaceId: '',
        resList: 'data.records',
        interfaceType: 'get',
        tipFont: '',
        dictKey: '',
        props: {
          value: 'dictValue',
          label: 'dictLabel'
        },
        disabled: false,
        valueType: 1,
      }
    },
    {
      type: 'checkbox',
      icon: 'icon-check-box',
      name: '复选框',
      flag: 0,
      options: {
        borderRadius: 'no',
        inline: false,
        defaultValue: 'undefined',
        showLabel: false,
        options: [{
          value: '选项1'
        },
        {
          value: '选项2'
        },
        {
          value: '选项3'
        }
        ],
        required: false,
        width: '',
        optionDataType: 1,
        interfaceMethod: '/system/SysDictData/getChildrenItemsByDictType',
        interfaceParam: '{"dictType":"sys_tenant_type"}',
        interfaceId: '',
        resList: 'data.records',
        interfaceType: 'get',
        tipFont: '',
        dictKey: '',
        props: {
          value: 'dictValue',
          label: 'dictLabel'
        },
        disabled: false,
      }
    },
    {
      type: 'select',
      icon: 'icon-select',
      name: '下拉选择',
      flag: 0,
      options: {
        multiple: false,
        borderRadius: 'no',
        defaultValue: '',
        disabled: false,
        clearable: false,
        placeholder: '',
        required: false,
        showLabel: false,
        width: '',
        options: [{
          value: '选项1'
        },
        {
          value: '选项2'
        },{
          value: '选项3'
        }
        ],
        filterable: false,
        optionDataType: 1,
        interfaceMethod: '/system/SysDictData/getChildrenItemsByDictType',
        interfaceParam: '{"dictType":"sys_tenant_type"}',
        interfaceId: '',
        resList: 'data.records',
        interfaceType: 'get',
        tipFont: '',
        dictKey: '',
        props: {
          value: 'dictValue',
          label: 'dictLabel'
        },
      }
    },
    {
      type: 'time',
      icon: 'icon-time',
      name: '时间选择器',
      flag: 1,
      options: {
        defaultValue: '21:19:56',
        readonly: false,
        disabled: false,
        editable: true,
        clearable: true,
        placeholder: '',
        startPlaceholder: '',
        endPlaceholder: '',
        isRange: false,
        arrowControl: true,
        tipFont: '',
        format: 'HH:mm:ss',
        required: false,
        width: '',
      }
    },
    {
      type: 'date',
      icon: 'icon-date',
      name: '日期选择器',
      flag: 0,
      options: {
        borderRadius: 'no',
        defaultValue: '',
        readonly: false,
        disabled: false,
        editable: true,
        clearable: true,
        placeholder: '',
        startPlaceholder: '',
        endPlaceholder: '',
        tipFont: '',
        type: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        timestamp: false,
        required: false,
        width: '',
      }
    },
    {
      type: 'imgupload',
      icon: 'icon-tupian',
      name: '上传',
      flag: 0,
      options: {
        resFormat: '',
        borderRadius: 'no',
        maxSize: 5,
        isAvatar: false,
        canUploadFile: false,
        uploadFileText: '点击上传',
        defaultValue: null,
        listWidth: 100,
        listHeight: 100,
        width: '',
        disabled: false,
        length: 8,
        // multiple: false,
        isDelete: true,
        required: false,
        tipFont: '',
        isShow: true,
        action: 'common/uploadOss',
        actionParams: '',
        isOriginalData: false,
        fileNameKey:'name',
        fileUrlNameKey:'url',
        fileIdKey:'fileId',
        fileIdsIsString: false,
        fileIdsToString:',',
        isVideo:false,
        isReturnUrl:false,
        returnArrayString:false
      }
    },
    {
      type: 'editor',
      icon: 'icon-fuwenbenkuang',
      name: '编辑器',
      flag: 1,
      options: {
        defaultValue: '',
        width: '',
        action: 'common/uploadOss',
        actionParams: '',
        maxSize: 5,
        resFormat: '',
        disabled: false
      }
    },
    {
      type: 'number',
      icon: 'icon-number',
      name: '计数器',
      flag: 0,
      options: {
        borderRadius: 'no',
        width: '',
        required: false,
        defaultValue: 0,
        tipFont: '',
        min: 1,
        max: 10,
        step: 1,
        disabled: false
      }
    },
    {
      type: 'rate',
      icon: 'icon-pingfen1',
      name: '评分',
      flag: 0,
      options: {
        borderRadius: 'no',
        defaultValue: null,
        max: 5,
        disabled: false,
        allowHalf: false,
        tipFont: '',
        required: false
      }
    },
    {
      type: 'color',
      icon: 'icon-color',
      name: '颜色选择器',
      flag: 1,
      options: {
        defaultValue: '',
        disabled: false,
        showAlpha: false,
        tipFont: '',
        required: false
      }
    },

    {
      type: 'switch',
      icon: 'icon-switch',
      name: '开关',
      flag: 0,
      options: {
        borderRadius: 'no',
        defaultValue: false,
        required: false,
        tipFont: '',
        disabled: false,
      }
    },
    {
      type: 'slider',
      icon: 'icon-slider',
      name: '滑块',
      flag: 0,
      options: {
        borderRadius: 'no',
        defaultValue: 0,
        disabled: false,
        required: false,
        min: 0,
        max: 100,
        step: 1,
        showInput: false,
        range: false,
        tipFont: '',
        width: ''
      }
    },
    {
      type: 'cascader',
      icon: 'icon-jilianxuanze',
      name: '级联选择器',
      flag: 0,
      options: {
        clearable: false,
        borderRadius: 'no',
        defaultValue: [],
        width: '',
        placeholder: '',
        disabled: false,
        required: false,
        showLabel: true,
        dataIsArray:true,
        options: [{
          value: 1,
          label: '选项1',
          children: [{
            value: 11,
            label: '选项1-1',
          }]
        },
        {
          value: 2,
          label: '选项2',
          children: [{
            value: 21,
            label: '选项2-1',
          }]
        }
        ],
        optionDataType: 1,
        interfaceMethod: '/system/SysGoodsItems/getGoodsItemLists',
        interfaceParam: '',
        interfaceId: '',
        resList: 'data.records',
        interfaceType: 'get',
        tipFont: '',
        dictKey: '',
        lazyLoad: false,
        multiple: false,
        parentIdsCode:'parentCode',
        props: {
          value: 'id',
          label: 'itemName',
          children: 'children'
        }
      }
    },
    {
      type: 'hide',
      icon: 'icon-closeEye',
      name: '接口隐藏字段',
      flag: 0,
      options: {
        defaultValue: '',
      }
    },
  ],
  layout: [{
    type: 'grid',
    icon: 'icon-grid-',
    name: '栅格布局',
    columns: [{
      span: 12,
      list: []
    },
    {
      span: 12,
      list: []
    }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  },
  {
    type: 'tabs',
    icon: 'icon-tabs',
    name: 'tabs标签页',
    tabs: [{
      name: "1",
      label: "tab1",
      list: []
    },
    {
      name: "2",
      label: "tab2",
      list: []
    }
    ],
    options: {
      activeTab: '1',
      type: "",
      align: 'top'
    }
  },
  {
    type: 'card',
    icon: 'icon-card',
    name: '卡片容器',
    list: [],
    options: {
      showHead: true,
      bodyPadding: "20",
      shadow: "always"
    }
  },
  {
    type: 'binding',
    icon: 'icon-card',
    name: '绑定容器',
    list: [],
    options: {
      addBtnText:'新增',
      addBtnType:'primary',
      delBtnText:'删除',
      delBtnType:'danger',
      btnSize:'mini',
      backgroundColor:'rgba(245, 250, 255, 1)',
      borderStyle:'dashed',
    }
  },
  {
    type: 'customAttr',
    icon: 'icon-card',
    name: '自定义属性容器',
    list: [],
  }
  ]
}

const mobileComponents = {
  base: []
}

const basicComponents = {
  pc: pcComponents,
  mobile: mobileComponents
}

export default basicComponents;
