<template>
  <div v-if="show">
    <el-form
      label-position="top"
      :model="data"
      size="mini"
    >
      <el-form-item
        label="关联组件字段"
        v-if="data.type!='grid' && data.bindChildren"
        prop="prop"
        :rules="[
          { required: true, message: '字段标识Key', trigger: 'blur' }
        ]"
      >
        <el-select v-model="data.prop" placeholder="请选择">
          <el-option
            v-for="item in bindItemList"
            :key="item.attrKey"
            :label="item.attrName"
            :value="item.attrKey">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="自定义属性字段"
        v-if="data.type!='customAttr' && data.customAttrChildren"
        prop="prop"
        :rules="[
          { required: true, message: '字段标识Key', trigger: 'blur' }
        ]"
      >
        <el-input v-model="data.prop"></el-input>
      </el-form-item>
      <el-form-item label="服务属性"
      v-if="data.type!='grid' && !data.bindChildren && !data.customAttrChildren">
        <service-attr v-bind="$attrs" :data="data"></service-attr>
      </el-form-item>
      <el-form-item
        label="字段名"
        v-show="data.type!='grid' && data.type!='hide' && data.type!='binding'"
      >
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <div v-show="data.type === 'binding'">
        <el-form-item
          label="新增按钮文本"
          v-show="Object.keys(data.options).indexOf('addBtnText')>=0"
        >
          <el-input v-model="data.options.addBtnText"></el-input>
        </el-form-item>
        <el-form-item
          label="新增按钮风格"
          v-show="Object.keys(data.options).indexOf('addBtnType')>=0"
        >
          <el-select v-model="data.options.addBtnType" placeholder="请选择">
            <el-option
              v-for="item in data.options.btnTypeList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="删除按钮文本"
          v-show="Object.keys(data.options).indexOf('delBtnText')>=0"
        >
          <el-input v-model="data.options.delBtnText"></el-input>
        </el-form-item>
        <el-form-item
          label="删除按钮风格"
          v-show="Object.keys(data.options).indexOf('delBtnType')>=0"
        >
          <el-select v-model="data.options.delBtnType" placeholder="请选择">
            <el-option
              v-for="item in BTN_TYPE_LIST"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="按钮大小"
          v-show="Object.keys(data.options).indexOf('btnSize')>=0"
        >
          <el-select v-model="data.options.btnSize" placeholder="请选择">
            <el-option
              v-for="item in BTN_SIZE_LIST"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="背景颜色"
          v-show="Object.keys(data.options).indexOf('backgroundColor')>=0"
        >
          <el-input v-model="data.options.backgroundColor"></el-input>
        </el-form-item>
        <el-form-item
          label="边框线风格"
          v-show="Object.keys(data.options).indexOf('borderStyle')>=0"
        >
          <el-select v-model="data.options.borderStyle" placeholder="请选择">
            <el-option
              v-for="item in BORDER_STYLE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item
        label="宽度"
        v-if="Object.keys(data.options).indexOf('width')>=0"
      >
        <el-input v-model="data.options.width"></el-input>
      </el-form-item>
      <el-form-item
        label="高度"
        v-if="Object.keys(data.options).indexOf('height')>=0"
      >
        <el-input v-model="data.options.height"></el-input>
      </el-form-item>
      <el-form-item
        label="行数"
        v-if="Object.keys(data.options).indexOf('row')>=0"
      >
        <el-input v-model="data.options.row"></el-input>
      </el-form-item>
      <el-form-item
        label="圆角半径(适用于移动端)"
        v-if="Object.keys(data.options).indexOf('borderRadius')>=0"
      >
        <el-radio-group v-model="data.options.borderRadius">
          <el-radio-button label="top">上</el-radio-button>
          <el-radio-button label="bottom">下</el-radio-button>
          <el-radio-button label="no">非</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否上传文件"
        v-if="data.type == 'imgupload'"
      >
        <el-switch v-model="data.options.canUploadFile"></el-switch>
      </el-form-item>
      <el-form-item
        label="是否上传视频"
        v-if="data.type == 'imgupload'&&(data.options.canUploadFile)"
      >
        <el-switch v-model="data.options.isVideo"></el-switch>
      </el-form-item>
      <el-form-item
        label="是否只返回url链接"
        v-if="data.type == 'imgupload'&&(data.options.canUploadFile) && data.options.isVideo"
      >
        <el-switch v-model="data.options.isReturnUrl"></el-switch>
      </el-form-item>
      <el-form-item
        label="是否上传头像"
        v-if="data.type == 'imgupload'&&(!data.options.canUploadFile)"
      >
        <el-switch v-model="data.options.isAvatar"></el-switch>
      </el-form-item>
      <el-form-item
        label="多图片是否只返回字符串数组"
        v-if="data.type == 'imgupload'&&(!data.options.isAvatar) && !data.options.canUploadFile"
      >
        <el-switch v-model="data.options.returnArrayString"></el-switch>
      </el-form-item>
      <el-form-item
        label="允许上传图片的大小MB"
        v-if="data.type == 'imgupload'"
      >
        <el-input v-model.number="data.options.maxSize"></el-input>
      </el-form-item>
      <el-form-item
        label="上传按钮文本"
        v-if="(data.options.canUploadFile)"
      >
        <el-input v-model="data.options.uploadFileText"></el-input>
      </el-form-item>
      <el-form-item
        label="大小"
        v-if="Object.keys(data.options).indexOf('listWidth')>=0&&Object.keys(data.options).indexOf('listHeight')>=0&&(!data.options.canUploadFile)"
      > 宽度： <el-input
          style="width: 90px;"
          type="number"
          v-model.number="data.options.listWidth"
        ></el-input>
        <br />高度： <el-input
          style="width: 90px;"
          type="number"
          v-model.number="data.options.listHeight"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="输入框提示内容"
        v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' && data.type!='date')"
      >
        <el-input v-model="data.options.placeholder"></el-input>
      </el-form-item>
      <el-form-item
        label="底部提示信息"
        v-if="Object.keys(data.options).indexOf('tipFont')>=0"
      >
        <el-input v-model="data.options.tipFont"></el-input>
      </el-form-item>
      <el-form-item
        label="鼠标悬浮提示"
        v-if="Object.keys(data.options).indexOf('mouseTips')>=0"
      >
        <el-input v-model="data.options.mouseTips"></el-input>
      </el-form-item>
      <el-form-item
        label="布局方式"
        v-if="Object.keys(data.options).indexOf('inline')>=0"
      >
        <el-radio-group v-model="data.options.inline">
          <el-radio-button :label="false">块级</el-radio-button>
          <el-radio-button :label="true">行内</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="显示输入框"
        v-if="Object.keys(data.options).indexOf('showInput')>=0"
      >
        <el-switch v-model="data.options.showInput"></el-switch>
      </el-form-item>
      <el-form-item
        label="最小值"
        v-if="Object.keys(data.options).indexOf('min')>=0"
      >
        <el-input
          v-model="data.options.min"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="最大值"
        v-if="Object.keys(data.options).indexOf('max')>=0"
      >
        <el-input
          v-model="data.options.max"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="步长"
        v-if="Object.keys(data.options).indexOf('step')>=0"
      >
        <el-input-number
          v-model="data.options.step"
          :min="0"
          :max="100"
          :step="1"
        ></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="是否多选" v-if="data.type=='select' || data.type=='imgupload'">
        <el-switch v-model="data.options.multiple" @change="handleSelectMuliple"></el-switch>
      </el-form-item>-->
      <el-form-item
        label="是否可搜索"
        v-if="data.type=='select'"
      >
        <el-switch v-model="data.options.filterable"></el-switch>
      </el-form-item>
      <el-form-item
        label="是否多选"
        v-if="data.type=='select'"
      >
        <el-switch v-model="data.options.multiple"></el-switch>
      </el-form-item>
      <el-form-item
        label="允许半选"
        v-if="Object.keys(data.options).indexOf('allowHalf')>=0"
      >
        <el-switch v-model="data.options.allowHalf"></el-switch>
      </el-form-item>
      <el-form-item
        label="支持透明度选择"
        v-if="Object.keys(data.options).indexOf('showAlpha')>=0"
      >
        <el-switch v-model="data.options.showAlpha"></el-switch>
      </el-form-item>
      <el-form-item
        label="选项"
        v-if="Object.keys(data.options).indexOf('options')>=0"
      >
        <el-radio-group
          v-model="data.options.optionDataType"
          size="mini"
          style="margin-bottom:10px;"
        >
          <el-radio-button :label="1">静态数据</el-radio-button>
          <el-radio-button :label="2">远端数据</el-radio-button>
          <el-radio-button :label="3" v-show="data.type=='cascader'">省市区</el-radio-button>
          <el-radio-button :label="4" v-show="data.type=='cascader'">省市</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.optionDataType==2">
          <div>
            <el-input
              size="mini"
              style
              v-model="data.options.interfaceMethod"
              placeholder="/api/getData"
            >
              <template slot="prepend">
                <div style="width:60px">远端方法</div>
              </template>
            </el-input>
            <el-input
              size="mini"
              style
              v-model="data.options.interfaceParam"
              placeholder="{参数名:参数值}"
            >
              <template slot="prepend">
                <div style="width:60px">请求参数</div>
              </template>
            </el-input>
            <el-input
              size="mini"
              style
              v-model="data.options.resList"
              placeholder="data.records"
            >
              <template slot="prepend">
                <div style="width:100px">请求结果的list对象</div>
              </template>
            </el-input>
            <el-input
              size="mini"
              style
              v-model="data.options.interfaceType"
              placeholder="get"
            >
              <template slot="prepend">
                <div style="width:100px">请求类型</div>
              </template>
            </el-input>
            <el-input
              size="mini"
              style
              v-model="data.options.props.value"
            >
              <template slot="prepend">
                <div style="width:60px">值</div>
              </template>
            </el-input>
            <el-input
              size="mini"
              style
              v-model="data.options.props.label"
            >
              <template slot="prepend">
                <div style="width:60px">标签</div>
              </template>
            </el-input>
          </div>
        </template>
        <template v-else-if="data.options.optionDataType==1">
          <div v-if="(Object.keys(data.options).indexOf('showLabel')>=0) && (data.type!='cascader')">是否显示标签：
            <el-switch v-model="data.options.showLabel"></el-switch>
          </div>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <el-radio-group
              v-model="data.options.defaultValue"
              class="ulRadio"
            >
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li
                  v-for="(item, index) in data.options.options"
                  :key="index"
                >
                  <el-radio
                    :label="item.value"
                    style="margin-right: 5px;"
                  >
                    <el-input
                      :style="{'width': data.options.showLabel? '70px': '140px' }"
                      size="mini"
                      v-model="item.value"
                    ></el-input>
                    <el-input
                      style="width:70px;"
                      size="mini"
                      v-if="data.options.showLabel"
                      v-model="item.label"
                    ></el-input>
                  </el-radio>
                  <i
                    class="drag-item"
                    style="font-size: 16px;margin: 0 5px;cursor: move;"
                  >
                    <i class="el-icon-rank"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </el-radio-group>
          </template>
          <template v-if="(data.type=='checkbox') || (data.type=='select' && data.options.multiple)">
            <el-checkbox-group
              v-model="data.options.defaultValue"
              class="ulRadio"
            >
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li
                  v-for="(item, index) in data.options.options"
                  :key="index"
                >
                  <el-checkbox
                    :label="item.value"
                    style="margin-right: 5px;"
                  >
                    <el-input
                      :style="{'width': data.options.showLabel? '70px': '140px' }"
                      size="mini"
                      v-model="item.value"
                    ></el-input>
                    <el-input
                      style="width:70px;"
                      size="mini"
                      v-if="data.options.showLabel"
                      v-model="item.label"
                    ></el-input>
                  </el-checkbox>
                  <i
                    class="drag-item"
                    style="font-size: 16px;margin: 0 5px;cursor: move;"
                  >
                    <i class="el-icon-rank"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <template v-if="(data.type=='cascader')">
            <div
              class="cascaderTree"
              style="overflow:auto;"
            >
              <el-tree
                :data="data.options.options"
                node-key="value"
                default-expand-all
                :expand-on-click-node="false"
              >
                <span
                  class="custom-tree-node"
                  slot-scope="{ node, data }"
                >
                  <span>
                    <el-input
                      :style="{'width':'70px'}"
                      size="mini"
                      v-model="data.value"
                    ></el-input>
                    <el-input
                      :style="{'width':'80px'}"
                      size="mini"
                      v-model="data.label"
                    ></el-input>
                  </span>
                  <span>
                    <el-button
                      @click="() => appendTree(data)"
                      circle
                      plain
                      type="primary"
                      size="mini"
                      icon="el-icon-plus"
                      style="padding: 4px;"
                    ></el-button>
                    <el-button
                      @click="() => removeTree(node, data)"
                      circle
                      plain
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="padding: 4px;margin-left: 5px;"
                    ></el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </template>
          <div style="margin-left: 22px;">
            <el-button
              type="text"
              @click="handleAddOption"
            >添加选项</el-button>
          </div>
        </template>
      </el-form-item>
      <el-form-item
        label="数据是否懒加载"
        v-if="data.type=='cascader' &&  data.options.optionDataType==2"
      >
        <el-switch v-model="data.options.lazyLoad"></el-switch>
      </el-form-item>
      <template v-if="data.type=='cascader' &&  (data.options.optionDataType==2 || data.options.optionDataType==1)">
        <el-form-item
          label="是否多选"
        >
          <el-switch v-model="data.options.multiple"></el-switch>
        </el-form-item>
        <el-form-item
          label="父级ID串的key值"
          v-show="data.options.multiple"
        >
        <el-input
          size="mini"
          v-model="data.options.parentIdsCode"
        ></el-input>
        </el-form-item>
      </template>
      <el-form-item
        label="接口返回值的类型转换为"
        v-if="data.type=='radio'"
      >
        <el-radio-group
          v-model="data.options.valueType"
        >
          <el-radio :label="1">
            不变
          </el-radio>
          <el-radio :label="2">
            数字
          </el-radio>
          <el-radio :label="3">
            字符串
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="返回数据是否是数组（否则是字符串）"
        v-if="data.type=='cascader'"
      >
      <el-switch v-model="data.options.dataIsArray" @change="changeCascaderDataType"></el-switch>
      </el-form-item>
      <el-form-item
        label="默认值"
        v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'imgupload'||data.type == 'textarea' || data.type == 'password'||data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch' || data.type == 'hide')"
      >
        <el-input
          v-if="data.type=='textarea'"
          type="textarea"
          :rows="5"
          v-model="data.options.defaultValue"
        ></el-input>
        <el-input
          v-if="data.type=='input'||data.type=='password'|| data.type=='hide'"
          v-model="data.options.defaultValue"
        ></el-input>
        <el-rate
          v-if="data.type == 'rate'"
          style="display:inline-block;vertical-align: middle;"
          :max="data.options.max"
          :allow-half="data.options.allowHalf"
          v-model="data.options.defaultValue"
        ></el-rate>
        <el-button
          type="text"
          v-if="data.type == 'rate'"
          style="display:inline-block;vertical-align: middle;margin-left: 10px;"
          @click="data.options.defaultValue=0"
        >清空</el-button>
        <el-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        ></el-color-picker>
        <!-- <el-color-picker
          v-if="data.type == 'imgupload'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        ></el-color-picker>-->
        <ty-upload
          v-if="(data.type == 'imgupload')&&(!data.options.isAvatar)"
          v-model="data.options.defaultValue"
          :length="data.options.length"
          :width="80"
          :height="80"
          :action="data.options.action"
        ></ty-upload>
        <ty-upload
          v-if="(data.type == 'imgupload')&&(data.options.isAvatar)"
          v-model="data.options.defaultValue"
          :isAvatar="true"
          :length="1"
          :width="80"
          :height="80"
          :action="data.options.action"
        ></ty-upload>
        <el-switch
          v-if="data.type=='switch'"
          v-model="data.options.defaultValue"
        ></el-switch>
      </el-form-item>
      <el-form-item
        label="插槽名称"
        v-if="Object.keys(data.options).indexOf('slotName')>=0&&(!data.component)"
      >
        <el-input v-model="data.options.slotName"></el-input>
      </el-form-item>
      <el-form-item
        label="业务组件名称(slot)"
        v-if="Object.keys(data.options).indexOf('slotName')>=0&&(data.component)"
      >
        <el-input
          v-model="data.options.slotName"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        label="HTML内容"
        v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && data.type=='text'"
      >
        <ty-editor
          v-model="data.options.defaultValue"
          style="width:100%;"
          menubar=""
          :toolbar="['bold italic underline strikethrough alignleft aligncenter alignright outdent indent', 'hr bullist numlist link   forecolor backcolor']
"
        ></ty-editor>
      </el-form-item>
      <el-form-item
        label="隐藏label"
        v-if="Object.keys(data.options).indexOf('hideLabel')>=0"
      >
        <el-checkbox v-model="data.options.hideLabel"></el-checkbox>
      </el-form-item>
      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item
          label="显示类型"
          v-if="data.type == 'date'"
        >
          <el-select v-model="data.options.type">
            <el-option value="year"></el-option>
            <el-option value="month"></el-option>
            <el-option value="date"></el-option>
            <el-option value="dates"></el-option>
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime"></el-option>
            <el-option value="datetimerange"></el-option>
            <el-option value="daterange"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否为范围选择"
          v-if="data.type == 'time'"
        >
          <el-switch v-model="data.options.isRange"></el-switch>
        </el-form-item>
        <el-form-item
          label="是否获取时间戳"
          v-if="data.type == 'date'"
        >
          <el-switch v-model="data.options.timestamp"></el-switch>
        </el-form-item>
        <el-form-item
          label="占位内容"
          v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')"
        >
          <el-input v-model="data.options.placeholder"></el-input>
        </el-form-item>
        <el-form-item
          label="开始时间占位内容"
          v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'"
        >
          <el-input v-model="data.options.startPlaceholder"></el-input>
        </el-form-item>
        <el-form-item
          label="结束时间占位内容"
          v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'"
        >
          <el-input v-model="data.options.endPlaceholder"></el-input>
        </el-form-item>
        <el-form-item label="显示格式">
          <el-input v-model="data.options.format"></el-input>
        </el-form-item>
        <el-form-item label="值格式">
          <el-input v-model="data.options.valueFormat"></el-input>
        </el-form-item>
        <el-form-item
          label="默认值"
          v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0"
        >
          <el-time-picker
            key="1"
            style="width: 100%;"
            v-if="!data.options.isRange"
            v-model="data.options.defaultValue"
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          ></el-time-picker>
          <el-time-picker
            key="2"
            v-if="data.options.isRange"
            style="width: 100%;"
            v-model="data.options.defaultValue"
            is-range
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          ></el-time-picker>
        </el-form-item>
      </template>
      <template v-if="data.type=='editor'">
        <template>
          <el-form-item
            label="图片上传地址"
            :required="true"
          >
            <el-input v-model="data.options.action"></el-input>
          </el-form-item>
          <el-form-item label="图片上传参数">
            <el-input
              v-model="data.options.actionParams"
              placeholder="{参数名:参数值}"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="图片上传地址接口返回的数据格式"
            :required="true"
          >
            <el-input v-model="data.options.resFormat"></el-input>
          </el-form-item>
          <el-form-item label="允许上传图片的大小MB">
            <el-input v-model.number="data.options.maxSize"></el-input>
          </el-form-item>
        </template>
      </template>
      <template v-if="data.type=='imgupload'">
        <template v-if="!data.options.isAvatar && !data.options.isVideo">
          <el-form-item label="最大上传数">
            <el-input
              type="number"
              v-model.number="data.options.length"
            ></el-input>
          </el-form-item>
        </template>
        <template>
          <el-form-item label="文件url名称key值">
            <el-input
            v-model="data.options.fileUrlNameKey"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件名称key值">
            <el-input
              v-model="data.options.fileNameKey"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件IDkey值">
            <el-input
            v-model="data.options.fileIdKey"
            ></el-input>
          </el-form-item>
          <el-form-item label="多个文件ID是否转换成字符串传参">
            <el-switch v-model="data.options.fileIdsIsString"></el-switch>
          </el-form-item>
          <template v-if="data.options.fileIdsIsString">
            <el-form-item label="多个文件ID转换成字符串的间隔符">
              <el-input
              v-model="data.options.fileIdsToString"
              ></el-input>
            </el-form-item> 
          </template>
          <el-form-item
            label="图片上传地址"
            :required="true"
          >
            <el-input v-model="data.options.action"></el-input>
          </el-form-item>
          <el-form-item label="图片上传参数">
            <el-input
              v-model="data.options.actionParams"
              placeholder="{参数名:参数值}"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="图片上传地址接口返回的数据格式"
            :required="true"
          >
            <el-input v-model="data.options.resFormat"></el-input>
          </el-form-item>
          <el-form-item label="返回的是否是原始数据">
            <el-switch v-model="data.options.isOriginalData"></el-switch>
          </el-form-item>
        </template>
      </template>
      <template v-if="data.type == 'grid'">
        <el-form-item label="栅格间隔">
          <el-input
            type="number"
            v-model.number="data.options.gutter"
          ></el-input>
        </el-form-item>
        <el-form-item label="列配置项">
          <draggable
            tag="ul"
            :list="data.columns"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
          >
            <li
              v-for="(item, index) in data.columns"
              :key="index"
            >
              <i
                class="drag-item"
                style="font-size: 16px;margin: 0 5px;cursor: move;"
              >
                <i class="el-icon-rank"></i>
              </i>
              <el-input
                placeholder="栅格值"
                size="mini"
                style="width: 100px;"
                type="number"
                v-model.number="item.span"
              ></el-input>
              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px;margin-left: 5px;"
              ></el-button>
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button
              type="text"
              @click="handleAddColumn"
            >添加列</el-button>
          </div>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select v-model="data.options.justify">
            <el-option
              value="start"
              label="左对齐"
            ></el-option>
            <el-option
              value="end"
              label="右对齐"
            ></el-option>
            <el-option
              value="center"
              label="居中"
            ></el-option>
            <el-option
              value="space-around"
              label="两侧间隔相等"
            ></el-option>
            <el-option
              value="space-between"
              label="两端对齐"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select v-model="data.options.align">
            <el-option
              value="top"
              label="顶部对齐"
            ></el-option>
            <el-option
              value="middle"
              label="居中"
            ></el-option>
            <el-option
              value="bottom"
              label="底部对齐"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="data.type == 'card'">
        <el-form-item label="是否显示标题">
          <el-radio-group v-model="data.options.showHead">
            <el-radio-button :label="false">隐藏</el-radio-button>
            <el-radio-button :label="true">显示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="body的padding(px)">
          <el-input
            type="text"
            v-model="data.options.bodyPadding"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置阴影显示时机">
          <el-select v-model="data.options.shadow">
            <el-option value="always"></el-option>
            <el-option value="hover"></el-option>
            <el-option value="never"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="data.type == 'tabs'">
        <el-form-item label="选中项">
          <el-input
            type="text"
            v-model="data.options.activeTab"
          ></el-input>
        </el-form-item>
        <el-form-item label="风格类型">
          <el-select v-model="data.options.type">
            <el-option
              value
              label="基础"
            ></el-option>
            <el-option
              value="card"
              label="选项卡"
            ></el-option>
            <el-option
              value="border-card"
              label="卡片化"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="tab项">
          <draggable
            tag="ul"
            :list="data.tabs"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
          >
            <li
              v-for="(item, index) in data.tabs"
              :key="index"
            >
              <i
                class="drag-item"
                style="font-size: 16px;margin: 0 5px;cursor: move;"
              >
                <i class="el-icon-rank"></i>
              </i>
              <el-input
                placeholder="name"
                size="mini"
                style="width: 100px;"
                type="text"
                v-model="item.name"
              ></el-input>
              <el-input
                placeholder="label"
                size="mini"
                style="width: 100px;"
                type="text"
                v-model="item.label"
              ></el-input>
              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px;margin-left: 5px;"
              ></el-button>
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button
              type="text"
              @click="handleAddColumn"
            >添加tab</el-button>
          </div>
        </el-form-item>
        <el-form-item label="tab位置">
          <el-select v-model="data.options.align">
            <el-option
              value="top"
              label="顶部"
            ></el-option>
            <el-option
              value="left"
              label="左边"
            ></el-option>
            <el-option
              value="right"
              label="右边"
            ></el-option>
            <el-option
              value="bottom"
              label="底部对齐"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="data.type != 'grid'&&showOperation">
        <el-form-item label="操作属性">
          <el-checkbox
            v-model="data.options.showText"
            v-if="Object.keys(data.options).indexOf('showText')>=0"
          >显示成文本形式</el-checkbox>
          <el-checkbox
            v-model="data.options.readonly"
            v-if="Object.keys(data.options).indexOf('readonly')>=0"
          >完全只读</el-checkbox>
          <el-checkbox
            v-model="data.options.disabled"
            v-if="Object.keys(data.options).indexOf('disabled')>=0"
          >禁用</el-checkbox>
          <el-checkbox
            v-model="data.options.hide"
            v-if="Object.keys(data.options).indexOf('hide')>=0"
          >隐藏</el-checkbox>
          <el-checkbox
            v-model="data.options.editable"
            v-if="Object.keys(data.options).indexOf('editable')>=0"
          >文本框可输入</el-checkbox>
          <el-checkbox
            v-model="data.options.clearable"
            v-if="Object.keys(data.options).indexOf('clearable')>=0"
          >显示清除按钮</el-checkbox>
          <el-checkbox
            v-model="data.options.arrowControl"
            v-if="Object.keys(data.options).indexOf('arrowControl')>=0"
          >使用箭头进行时间选择</el-checkbox>
          <el-checkbox
            v-model="data.options.isDelete"
            v-if="Object.keys(data.options).indexOf('isDelete')>=0"
          >删除</el-checkbox>
          <el-checkbox
            v-model="data.options.isEdit"
            v-if="Object.keys(data.options).indexOf('isEdit')>=0"
          >编辑</el-checkbox>
          <el-checkbox
            v-model="data.options.isShow"
            v-if="Object.keys(data.options).indexOf('isShow')>=0"
          >查看</el-checkbox>
        </el-form-item>
        <el-form-item label="校验">
          <div v-if="Object.keys(data.options).indexOf('required')>=0">
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
          </div>
          <div v-if="Object.keys(data.options).indexOf('validator')>=0">
            <el-input
              size="mini"
              placeholder="请输入自定义验证方法名"
              v-model.lazy="data.options.validator"
            >
            </el-input>
          </div>
          <div v-if="Object.keys(data.options).indexOf('dataType')>=0">
            <el-select
              v-model="data.options.dataType"
              size="mini"
            >
              <el-option
                value="string"
                label="字符串"
              ></el-option>
              <el-option
                value="number"
                label="数字"
              ></el-option>
              <el-option
                value="boolean"
                label="布尔值"
              ></el-option>
              <el-option
                value="integer"
                label="整数"
              ></el-option>
              <el-option
                value="float"
                label="浮点数"
              ></el-option>
              <el-option
                value="url"
                label="URL地址"
              ></el-option>
              <el-option
                value="email"
                label="邮箱地址"
              ></el-option>
              <el-option
                value="phone"
                label="电话"
              ></el-option>
              <el-option
                value="idCard"
                label="身份证"
              ></el-option>
              <el-option
                value="hex"
                label="十六进制"
              ></el-option>
            </el-select>
          </div>
          <div v-if="Object.keys(data.options).indexOf('maxlength')>=0">
            <el-input
              size="mini"
              style
              v-model.lazy="data.options.maxlength"
            >
              <template slot="prepend">
                <div style="width:100px">最大输入长度</div>
              </template>
            </el-input>
          </div>
          <div v-if="Object.keys(data.options).indexOf('minlength')>=0">
            <el-input
              size="mini"
              style
              v-model.lazy="data.options.minlength"
            >
              <template slot="prepend">
                <div style="width:100px">最小输入长度</div>
              </template>
            </el-input>
          </div>
          <div v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <el-input
              size="mini"
              style
              v-model.lazy="data.options.pattern"
            >
              <template slot="prepend">
                <div style="width:100px">正则表达式</div>
              </template>
            </el-input>
          </div>
          <div v-if="Object.keys(data.options).indexOf('patternTips')>=0">
            <el-input
              size="mini"
              style
              v-model.lazy="data.options.patternTips"
            >
              <template slot="prepend">
                <div style="width:100px">正则表达式错误提示</div>
              </template>
            </el-input>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
import Draggable from "vuedraggable";
import TyEditor from "components/TyEditor";
import TyUpload from "components/TyUpload";
import serviceAttr from "./components/serviceAttr.vue";
import { eventBus } from "../eventBus/bindEventBus";
import { BTN_SIZE_LIST, BTN_TYPE_LIST, BORDER_STYLE_LIST } from '../json/enum';
export default {
  components: {
    Draggable,
    TyEditor,
    TyUpload,
    serviceAttr
  },
  props: ["data"],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null,
      },
      bindItemList:[],
      BTN_SIZE_LIST:BTN_SIZE_LIST.options,
      BTN_TYPE_LIST:BTN_TYPE_LIST.options,
      BORDER_STYLE_LIST:BORDER_STYLE_LIST.options
    };
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
    showOperation() {
      const OperationArr = ["pattern", "maxlength", "minlength", "dataType", "required", "readonly",
        "disabled", "hide", "editable", "clearable", "arrowControl", "isDelete", "isEdit", "showText"
      ];
      return (Object.keys(this.data.options).findIndex(item => OperationArr.indexOf(item) >= 0) >= 0);
    },
  },
  mounted(){
    eventBus.$on('getParentData',(data) => {
      this.bindItemList = data;
    })
  },
  methods: {
    appendTree(data) {
      const newChild = {
        value: new Date().getTime().toString(),
        label: '新选项'
      };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
    removeTree(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.value === data.value);
      children.splice(index, 1);
    },
    //富文本子组件传来的值
    quillEditor(e) {
      this.data.options.defaultValue = e;
    },
    //刷新远程数据
    refreshOption() {
      const key = Date.parse(new Date());
      this.data.options.interfaceId = key;
    },
    handleOptionsRemove(index) {
      if (this.data.type === "grid") {
        this.data.columns.splice(index, 1);
      }
      else {
        this.data.options.options.splice(index, 1);
      }
    },
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: "新选项",
          label: "新选项"
        });
      }
      else {
        this.data.options.options.push({
          value: "新选项"
        });
      }
    },
    handleAddColumn() {
      this.data.columns.push({
        span: "",
        list: []
      });
    },
    generateRule() {
      this.data.rules = [];
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key]);
        }
      });
      //console.log(this.data.rules, this.validator, "-----this.validator");
    },
    // handleSelectMuliple(value) {
    //   if (value) {
    //     if (this.data.options.defaultValue) {
    //       this.data.options.defaultValue = [this.data.options.defaultValue];
    //     } else {
    //       this.data.options.defaultValue = [];
    //     }
    //   } else {
    //     if (this.data.options.defaultValue.length > 0) {
    //       this.data.options.defaultValue = this.data.options.defaultValue[0];
    //     } else {
    //       this.data.options.defaultValue = "";
    //     }
    //   }
    // },
    validateCustomMethod(val) {
      if (!this.show) {
        return false;
      }
      if (val) {
        this.validator.validator = {
          validator: val
        };
      }
      else {
        this.validator.validator = null;
      }
      this.generateRule();
    },
    validateRequired(val) {
      if (val) {
        this.validator.required = {
          required: true,
          message: `${this.data.name}不能为空`
        };
      }
      else {
        this.validator.required = null;
      }
      this.$nextTick(() => {
        this.generateRule();
      });
    },
    validateMin(val) {
      if (val) {
        this.validator.length = {
          min: parseInt(val),
          message: `${this.data.name}长度不能小于${val}`
        };
      }
      else {
        this.validator.length = null;
      }
      this.$nextTick(() => {
        this.generateRule();
      });
    },
    validateDataType(val) {
      if (!this.show) {
        return false;
      }
      if (val) {
        let lable = "";
        switch (val) {
          case "string":
            lable = "字符串";
            break;
          case "number":
            lable = "数字";
            break;
          case "boolean":
            lable = "布尔值";
            break;
          case "integer":
            lable = "整数";
            break;
          case "float":
            lable = "浮点数";
            break;
          case "url":
            lable = "URL地址";
            break;
          case "phone":
            lable = "电话";
          case "idCard":
            lable = "身份证";
          case "email":
            lable = "邮箱地址";
            break;
          case "hex":
            lable = "十六进制";
            break;
        }
        if (val == 'phone') {
          this.validator.validator = null;
          this.validator.type = null;
          this.validator.validator = {
            validator: "designFormValidatorPhone"
          };
        }
        else if (val == 'idCard') {
          this.validator.validator = null;
          this.validator.type = null;
          this.validator.validator = {
            validator: "designFormValidatorIdCard"
          };
        }
        else {
          this.validator.validator = null;
          this.validator.type = null;
          this.validator.type = {
            type: val,
            message: `请输入${lable}类型数据`
          };
        }
      }
      else {
        this.validator.validator = null;
        this.validator.type = null;
      }
      this.generateRule();
    },
    valiatePattern(val) {
      if (!this.show) {
        return false;
      }
      if (val) {
        this.validator.pattern = {
          pattern: val,
          message: this.data.options.patternTips || "格式不匹配"
        };
      }
      else {
        this.validator.pattern = null;
      }
      this.generateRule();
    },
    changeCascaderDataType(value) {
      if(value){
        this.data.options.defaultValue = []
      } else {
        this.data.options.defaultValue = ''
      }
    },
  },
  watch: {
    "data.name": function(val) {
      this.validateRequired(this.data.options.required);
      this.validateMin(this.data.options.minlength);
    },
    "data.options.isAvatar": function(val) {
      if (this.data.type == 'imgupload') {
        if (val) {
          this.data.options.defaultValue = "";
        }
        else {
          this.data.options.defaultValue = [];
        }
      }
    },
    "data.options.canUploadFile": function(val) {
      if (val) {
        this.data.options.isAvatar = false;
      }
    },
    "data.options.optionDataType": function(val) {
      this.refreshOption();
    },
    "data.options.isRange": function(val) {
      if (typeof val !== "undefined") {
        if (val) {
          this.data.options.defaultValue = null;
        }
        else {
          if (Object.keys(this.data.options).indexOf("defaultValue") >= 0) this.data.options.defaultValue =
            "";
        }
      }
    },
    "data.options.required": function(val) {
      this.validateRequired(val);
    },
    "data.options.dataType": function(val) {
      this.validateDataType(val);
    },
    "data.options.pattern": function(val) {
      this.valiatePattern(val);
    },
    "data.options.pattern": function(val) {
      this.valiatePattern(val);
    },
    "data.options.minlength": function(val) {
      this.validateMin(val);
    },
    "data.options.patternTips": function(val) {
      if (this.data.options) {
        this.valiatePattern(this.data.options.pattern);
      }
    },
    "data.options.validator": function(val) {
      this.validateCustomMethod(val);
    },
  }
};

</script>
<style scoped>
.ulRadio ul {
  padding: 0;
  margin: 0;
}

.cascaderTree ::v-deep .el-tree-node__children {
  overflow: visible;
}

</style>
