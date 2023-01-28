<template>
  <div class="fmDesignItem">
    <template v-if="widget.type=='title'">
      <div class="formItem-head">{{widget.name}}</div>
    </template>
    <template v-if="widget.type=='slot'">
      <slot
        :name="widget.options.slotName"
        :data="dataModel"
      >
        <div
          style="background:#f1f1f1;height:50px;line-height:50px;font-size:14px;text-align:center;margin:5px 0;"
        >
          {{widget.name}}
        </div>
      </slot>
    </template>
    <template v-if="widget.type == 'input'">
      <div
        v-if="widget.options.showText"
        class="fmDesignItem__text"
      >{{dataModel}}</div>
      <el-input
        v-else-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        type="number"
        v-model.number="dataModel"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :disabled="widget.options.disabled"
        :title="widget.options.mouseTips"
        :minlength="widget.options.minlength"
        :maxlength="widget.options.maxlength"
      ></el-input>
      <el-input
        v-else
        :clearable="widget.options.clearable"
        :type="widget.options.dataType"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :title="widget.options.mouseTips"
        :minlength="widget.options.minlength"
        :maxlength="widget.options.maxlength"
      ></el-input>
    </template>
    <template v-if="widget.type == 'password'">
      <el-input
        autocomplete="off"
        type="password"
        v-model="dataModel"
        :clearable="widget.options.clearable"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :title="widget.options.mouseTips"
        :minlength="widget.options.minlength"
        :maxlength="widget.options.maxlength"
        :show-password="widget.options.showPassword"
        
      ></el-input>
    </template>
    <template v-if="widget.type == 'textarea'">
      <el-input
        type="textarea"
        :rows="widget.options.row"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :maxlength="widget.options.maxlength"
        :style="{width: widget.options.width}"
        show-word-limit
      ></el-input>
    </template>
    <template v-if="widget.type == 'number'">
      <el-input-number
        v-model="dataModel"
        :style="{width: widget.options.width}"
        :step="widget.options.step"
        :disabled="widget.options.disabled"
        :min="Number(widget.options.min)"
        :max="Number(widget.options.max)"
      ></el-input-number>
    </template>
    <template v-if="widget.type == 'radio'">
      <ty-radio
        :key="widget.options.interfaceId"
        :value.sync="dataModel"
        :width="widget.options.width"
        :disabled="widget.options.disabled"
        :options="(widget.options.options)"
        :remote="widget.options.optionDataType=='2'"
        :inline="widget.options.inline"
        :interfaceMethod="widget.options.interfaceMethod"
        :interfaceParam="widget.options.interfaceParam"
        :interfaceType="widget.options.interfaceType"
        :optItem="widget.options.props"
        :showLabel="widget.options.showLabel"
        :resList="widget.options.resList"
        :valueType="widget.options.valueType"
      ></ty-radio>
    </template>
    <template v-if="widget.type == 'checkbox'">
      <ty-checkbox
        :key="widget.options.interfaceId"
        v-model="dataModel"
        :width="widget.options.width"
        :disabled="widget.options.disabled"
        :options="(widget.options.options)"
        :remote="widget.options.optionDataType=='2'"
        :inline="widget.options.inline"
        :interfaceMethod="widget.options.interfaceMethod"
        :interfaceParam="widget.options.interfaceParam"
        :interfaceType="widget.options.interfaceType"
        :optItem="widget.options.props"
        :showLabel="widget.options.showLabel"
        :resList="widget.options.resList"
      ></ty-checkbox>
    </template>
    <template v-if="widget.type == 'time'">
      <el-time-picker
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{width: widget.options.width}"
      ></el-time-picker>
    </template>
    <template v-if="widget.type=='date'">
      <el-date-picker
        v-model="dataModel"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.valueFormat ? widget.options.valueFormat : widget.options.format"
        :format="widget.options.format"
        :style="{width: widget.options.width}"
        :range-separator="widget.options.rangeSeparator"
      ></el-date-picker>
    </template>
    <template v-if="widget.type =='rate'">
      <el-rate
        style="margin-top:10px;"
        v-model="dataModel"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :allow-half="widget.options.allowHalf"
      ></el-rate>
    </template>
    <template v-if="widget.type == 'color'">
      <el-color-picker
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      ></el-color-picker>
    </template>
    <template v-if="widget.type == 'select'">
      <ty-dictionary
        :key="widget.options.interfaceId"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :width="widget.options.width"
        :filterable="widget.options.filterable"
        :options="(widget.options.options)"
        :remote="widget.options.optionDataType=='2'"
        :action="widget.options.interfaceMethod"
        :actionParams="widget.options.interfaceParam"
        :interfaceType="widget.options.interfaceType"
        :optItem="widget.options.props"
        :resList="widget.options.resList"
      ></ty-dictionary>
    </template>
    <template v-if="widget.type=='switch'">
      <el-switch
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :active-color="widget.options.activeColor"
        :inactive-color="widget.options.inactiveColor"
        :active-value="widget.options.activeValue"
        :inactive-value="widget.options.inactiveValue"
      ></el-switch>
    </template>
    <template v-if="widget.type=='slider'">
      <el-slider
        :value="dataModelNumber"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: widget.options.width}"
        @input="changeSliderFun"
      ></el-slider>
    </template>
    <template v-if="widget.type=='imgupload'">
      <ty-upload
        v-if="!widget.options.canUploadFile"
        :isAvatar="widget.options.isAvatar"
        v-model="dataModel"
        :style="{'width': widget.options.width}"
        :length="widget.options.length"
        :width="widget.options.listWidth"
        :height="widget.options.listHeight"
        :action="widget.options.action"
        :disabled="widget.options.disabled"
        :isShow="widget.options.isShow"
        :isDelete="widget.options.isDelete"
        :multiple="widget.options.multiple"
        :actionParams="widget.options.actionParams || {}"
        :imgMaxSize="widget.options.maxSize"
        :resFormat="widget.options.resFormat"
        :isOriginalData="widget.options.isOriginalData"
        :fileNameKey="widget.options.fileNameKey"
        :fileUrlNameKey="widget.options.fileUrlNameKey"
        :returnArrayString="widget.options.returnArrayString"
      ></ty-upload>
      <ty-upload-file
        v-else
        v-model="dataModel"
        :style="{'width': widget.options.width}"
        :length="widget.options.length"
        :action="widget.options.action"
        :disabled="widget.options.disabled"
        :isDownload="widget.options.isShow"
        :isDelete="widget.options.isDelete"
        :uploadFileText="widget.options.uploadFileText"
        :actionParams="widget.options.actionParams || {}"
        :fileMaxSize="widget.options.maxSize"
        :resFormat="widget.options.resFormat"
        :fileSuffixs="widget.options.fileSuffixs"
        :isOriginalData="widget.options.isOriginalData"
        :fileNameKey="widget.options.fileNameKey"
        :fileUrlNameKey="widget.options.fileUrlNameKey"
        :fileIdKey="widget.options.fileIdKey"
        :fileIdsIsString="widget.options.fileIdsIsString"
        :fileIdsToString="widget.options.fileIdsToString"
        :isVideo="widget.options.isVideo"
        :isReturnUrl="widget.options.isReturnUrl"
      ></ty-upload-file>
    </template>
    <template v-if="widget.type == 'editor'">
      <ty-editor
        v-model="dataModel"
        :style="{width: widget.options.width}"
        :action="widget.options.action"
        :actionParams="widget.options.actionParams"
        :imgMaxSize="widget.options.maxSize"
        :resFormat="widget.options.resFormat"
        :id="widget.options.id"
        :disabled="widget.options.disabled"
      ></ty-editor>
    </template>
    <template v-if="widget.type == 'cascader'">
      <ty-cascader
        :width="widget.options.width"
        :actionParams="widget.options.interfaceParam"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :key="widget.options.interfaceId"
        :placeholder="widget.options.placeholder"
        :options="(widget.options.options)"
        :optionDataType="widget.options.optionDataType"
        :action="widget.options.interfaceMethod"
        :interfaceType="widget.options.interfaceType"
        :optItem="widget.options.props"
        :resList="widget.options.resList"
        :clearable="widget.options.clearable"
        :dataIsArray="widget.options.dataIsArray"
        :lazyLoad="widget.options.lazyLoad"
        :multiple="widget.options.multiple"
        :parentIdsCode="widget.options.parentIdsCode"
      ></ty-cascader>
    </template>
    <template v-if="widget.type == 'text'">
      <div
        :class="`fmDesignItem__editor__text`"
        :style="{width:widget.options.width}"
      >
        <div
          class="editor-text"
          v-html="dataModel"
        ></div>
      </div>
    </template>
  </div>
</template>
<script>
import TyRadio from "components/TyRadio";
import TyCheckbox from "components/TyCheckbox";
import TyDictionary from "components/TyDictionary";
import TyCascader from "components/TyCascader";
import TyUpload from "components/TyUpload";
import TyEditor from "components/TyEditor";
export default {
  props: ["widget", "value"],
  components: {
    TyUpload,
    TyEditor,
    TyDictionary,
    TyCheckbox,
    TyRadio,
    TyCascader
  },
  data() {
    return {
      dataModel: this.value,
    };
  },
  created() {},
  methods: {
    changeSliderFun(val) {
      this.dataModel = val;
    },
  },
  computed: {
    dataModelNumber() {
      return Number(this.dataModel)
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.$emit("update:value", val);
        this.$emit("change", val);
      }
    },
    value: {
      deep: true,
      handler(val) {
        this.dataModel = val;
      }
    }
  }
};

</script>
<style lang="scss">
.fmDesignItem__editor__text {
  display: inline-block;

  * {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  
  img {
    max-width: 100%;
  }
  
  .editor-text {
    min-height: 20px;
  }
}

.fmDesignItem__text {
  text-align: left;
}

.fmDesignItem {
  .el-radio-group {
    .el-radio {
      margin: 10px 10px 0 0;
      white-space: normal;
    }
  }
  
  .el-checkbox-group {
    .el-checkbox {
      white-space: normal;
    }
  }
}

</style>
