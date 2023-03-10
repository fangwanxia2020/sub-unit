<template>
  <div
    class="ty-upload-file"
    :style="{ width }"
  >
    <el-upload
      ref="tyUploadFile"
      :http-request="uploadFile"
      :on-change="handleChange"
      :file-list.sync="fileList"
      :disabled="disabled"
      :limit="length"
      :action="action"
      :on-success="handleSuccess"
      :before-upload="beforeUploadHandle"
      :on-exceed="handleExceed"
      :multiple="multiple"
      :on-error="handleError"
      :before-remove="beforeRemoveFun"
      :auto-upload="autoUpload"
      :show-file-list="showUploadList && !isDraggable"
      :accept="accept"
    >
      <slot name="trigger">
        <el-button
          size="small"
          type="primary"
        >{{uploadFileText}}</el-button>
      </slot>
      <div
        class="el-upload__tip"
        slot="tip"
      >
        <slot name="tip"></slot>
      </div>
      <template #file="{ file }">
        <div
          :class="{
            'el-upload__list': true,
            errorFont: file.status != 'success'
          }"
        >
          <ty-upload-file-item
            :file="file"
            :isDelete="isDelete"
            :disabled="disabled"
            :showUrl="showUrl"
            @download="handleDownload(file)"
            @remove="handleRemove(file)"
          >
            <template #default="slotProps">
              <slot name="fileOperator" v-bind="slotProps" />
            </template>
          </ty-upload-file-item>
        </div>
      </template>
    </el-upload>
    <transition-group
      v-if="isDraggable && showUploadList"
      name="el-list"
      tag="ul"
      :class="[
        'el-upload-list',
        'el-upload-list--text',
        { 'is-disabled': disabled }
      ]"
    >
      <vue-draggable
        group="description"
        ghostClass="ghost"
        class="ty-upload-file-draggable"
        v-model="fileList"
        :key="vueDraggableKey"
        :disabled="false"
        :animation="200"
        @start="handleDragStart"
        @end="handleDragEnd"
      >
        <li
          v-for="file in fileList"
          :key="file.uid"
          :class="[
            'el-upload-list__item',
            'is-' + (file.status || 'success')
          ]"
        >
          <div
            :class="{
              'el-upload__list': true,
              errorFont: Boolean(file.status) && file.status != 'success'
            }"
          >
            <ty-upload-file-item
              :file="file"
              :isDelete="isDelete"
              :disabled="disabled"
              :showUrl="showUrl"
              @download="handleDownload(file)"
              @remove="handleRemove(file)"
            >
              <template #default="slotProps">
                <slot name="fileOperator" v-bind="slotProps" />
              </template>
            </ty-upload-file-item>
          </div>
        </li>
      </vue-draggable>
    </transition-group>

    <!-- ????????? -->
    <el-progress
      v-if="showUploadList"
      v-show="progress"
      style="margin-top:5px;"
      status="success"
      :stroke-width="3"
      :show-text="false"
      :percentage="percentage"
    />
  </div>
</template>
<script>
import VueDraggable from 'vuedraggable'
import { uploadFile } from "./api";
import TyUploadFileItem from './TyUploadFileItem'
/**
 * ??????????????????
 * @module TyUploadFile
 * @author lyt
 * @date 2020???06???09??? 15:00
 * @vue-prop {Object[]} [value] ??????????????????(v-model)
 * @vue-prop {boolean} [showUploadList] ????????????????????????
 * @vue-prop {boolean} [showUrl] ???????????? url
 * @vue-prop {Object} [actionParams] ????????????
 * @vue-prop {string} [action] ??????????????????
 * @vue-prop {boolean} [multiple] ???????????????????????????
 * @vue-prop {string|number} [fileMaxSize] ???????????????????????????MB
 * @vue-prop {stringnumber} [length] ???????????????????????????
 * @vue-prop {boolean} [disabled] ????????????
 * @vue-prop {string} [width] ??????
 * @vue-prop {string|string[]} [fileSuffixs] ??????????????????????????? ()=>["gif", "png", "jpg", "jpeg", "dwg", "dwl", "dxf"]
 * @vue-prop {boolean} [isDownLoad] ???????????????????????????true,isDownLoad???false?????????emit handleFile???????????????????????????
 * @vue-prop {boolean} [isDelete] ???????????????
 * @vue-prop {string} [uploadFileText] ??????????????????
 * @vue-prop {string} [resFormat] ????????????????????????????????????
 * @vue-prop {Function} [beforeUpload] ?????????????????????????????????????????????
 * @vue-prop {Function} [onChange] ?????????????????????????????????
 * @vue-prop {boolean} [autoUpload] ??????????????????????????????????????????
 * @vue-prop {boolean} [needToken] ??????????????????token
 * @vue-prop {Function} [onSuccess] ??????????????????????????????
 * @vue-prop {Function} [httpRequest] ????????????????????????????????????????????????????????????
 * @vue-prop {string} [method] ????????????
 * @vue-prop {number} [timeout] ???????????????????????????ms
 * @vue-prop {boolean} [isDraggable=true] ???????????????
 * @vue-event {Object} input ??????????????????(v-model)
 * @vue-event {Object} change ??????????????????
 * @example <caption>????????????</caption>
 * // <ty-upload-file v-model="fileVal" :showUrl="true"></ty-upload-file>
 */
export default {
  name: "TyUploadFile1",
  components: {
    TyUploadFileItem,
    VueDraggable
  },
  props: {
    showUploadList: {
      type: Boolean,
      default: true
    },
    showUrl: {
      //??????url?????????
      type: Boolean,
      default: false
    },
    //????????????
    //  fileType ??????????????????
    //  1????????????2????????????3?????????????????????zip
    //  fileUseType ??????????????????
    //  1?????????2????????????3????????????4???????????????5??????,????????????
    actionParams: {
      type: Object,
      default: () => ({})
    },
    action: {
      type: String,
      default: '/common/uploadOss'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    fileMaxSize: {
      type: [String, Number],
      default: 100
    },
    length: {
      type: [String, Number],
      default: 800
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      //??????
      type: String,
      default: "300px"
    },
    fileSuffixs: {
      default: "all"
    },
    isDownLoad: {
      //??????
      type: Boolean,
      default: true
    },
    isDelete: {
      //??????
      type: Boolean,
      default: true
    },
    uploadFileText: {
      type: String,
      default: "????????????"
    },
    resFormat: {
      type: String,
      default: ''
    },
    beforeUpload: {
      type: Function | null,
      default: null
    },
    onChange: {
      type: Function | null,
      default: null
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    needToken: {
      type: Boolean,
      default: true
    },
    onSuccess: {
      type: Function | null,
      default: null
    },
    httpRequest: {
      type: Function | null,
      default: null
    },
    method: {
      type: String,
      default: 'post'
    },
    timeout: {
      type: Number,
      default: 600 * 1000  // ?????? 10 ??????
    },
    isDraggable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const value = this.value || [];
    return {
      fileList: value,
      percentage: 0,
      progress: false,
      vueDraggableKey: 'vue-draggable-init',
      accept:'',
    };
  },
  watch: {
    //?????????????????????????????????????????????????????????????????????????????????
    value() {

      this.fileList = this.value;
      console.error('--this.fileList---')
      console.error( this.fileList)
    },
    fileSuffixs: {
      immediate: true,
      handler(val) {
        if(Array.isArray(val)) {
          this.accept = val.map(v => `.${v}`).join(',')
        }
      }
    }
  },
  methods: {
    //???????????????
    beforeRemoveFun() {
      if ((!this.disabled) && this.isDelete) {
        return true;
      }
      return false;
    },
    //????????????
    handleDownload(file) {
      console.error('==file=')
      console.error(file)
      if (!this.isDownLoad) {
        this.$emit('handleFile',file)
        return;
      }
      const {
        id,
        name,
        res
      } = file;
      this.downloadUrlFile(res.downloadUrl, name);
    },
    //????????????
    uploadFile(item) {
      if (this.httpRequest) {
        this.httpRequest(item);
        return;
      }
      let formData = new FormData();
      let paramsObj = this.actionParams || {};
      if (paramsObj && (typeof paramsObj == "string")) {
        paramsObj = JSON.parse(paramsObj);
      }
      for (var key in paramsObj) {
        formData.append([key], paramsObj[key]);
      }
      formData.append("file", item.file);
      if (paramsObj.fileType && paramsObj.fileType == 3) {
        formData.append("zipFile", file);
      }
      const onUploadProgress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          this.progress = true;
          let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
          this.percentage = Number(val);
        }
      }
      uploadFile(this.action, this.method, formData, onUploadProgress, this.needToken, this.timeout).then(response => {
        let data = response;
        if (this.resFormat) {
          const bb = this.resFormat.split(".");
          bb.forEach(i => {
            data = data[i];
          });
        }
        const {
          fileUrl,
          name,
          id
        } = data[0] || data;
        const fileData = {
          url: (data[0] || data).downloadUrl,
          name: name,
          id: id,
          res: (data[0] || data)
        };
        this.fileList.push(fileData);
        this.$emit("input", this.fileList);
        this.$emit("change", {
          value: this.fileList,
          res: data
        });
        setTimeout(() => {
          this.percentage = 0;
          this.progress = false;
        }, 1000);
      }).catch(e => {
        // ??????????????????
        this.$emit('upload-error', e);
        setTimeout(() => {
          this.percentage = 0;
          this.progress = false;
        }, 1000);
      })
    },
    // ???????????????, ???????????????handleChange
    beforeUploadHandle(file) {
      try {
        //??????????????????
        if (this.fileMaxSize && this.fileMaxSize > 0) {
          const isLt2M = file.size / 1024 / 1024 < this.fileMaxSize;
          if (!isLt2M) {
            this.$message.error(`???????????????????????? ${this.fileMaxSize}MB!`);
            return false;
          }
        }
        //??????????????????
        if (this.fileSuffixs != "all") {
          const includes = this.fileSuffixCheck(file);
          const suffixList = this.fileSuffixs;
          if (!includes) {
            this.$message.error(`???????????????????????????????????????${suffixList.join("???")}`);
            return false;
          }
        }
        // autoUpload ?????? false ???????????????
        if (this.beforeUpload) {
          this.beforeUpload(file);
        }
        return true;
      } catch (e) {
        console.error("??????????????????", e);
        return false;
      }
    },
    //????????????
    handleExceed(files, fileList) {
      this.$message.error(`?????????????????? ${this.length}??????????????????????????? ${
          files.length
        } ???????????????????????? ${files.length + fileList.length} ?????????`);
    },
    //??????????????????
    fileSuffixCheck(file) {
      const {
        name
      } = file;
      const nameArr = name.split(".");
      // ????????????
      const suffix = nameArr[nameArr.length - 1].toLowerCase();
      const suffixList = this.fileSuffixs;
      return suffixList.includes(suffix);
    },
    //????????????
    handleSuccess(res, file, fileList) {
      if (this.onSuccess) {
        this.onSuccess(res, file, fileList);
      }
    },
    //????????????
    handleError(err, file, fileList) {
      console.log(err);
      console.log(file);
    },
    //????????????
    handleRemove(file, fileList) {
      this.fileList.splice(this.fileList.findIndex(item => item === file), 1);
      this.$emit("input", this.fileList);
      this.$emit("change", {
        value: this.fileList,
        res: {}
      });
    },
    downloadUrlFile(url, fileName) {
      console.error(url)
      url = url.replace(/\\/g, "/");
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.saveAs(xhr.response, fileName);
        }
      };
      xhr.send();
    },
    saveAs(data, filename) {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        //IE??????????????????????????????
        var type = "text/plain; charset=UTF-8";
        var blob = typeof File === "function" ? new File([data], filename, {
          type: type
        }) : new Blob([data], {
          type: type
        });
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(blob, filename);
        }
        else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);
          if (filename) {
            var a = document.createElement("a");
            if (typeof a.download === "undefined") {
              window.location = downloadUrl;
            }
            else {
              a.href = downloadUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
            }
          }
          else {
            window.location = downloadUrl;
          }
        }
      }
      else {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = filename;
        save_link.click();
      }
    },
    handleChange(file, fileList) {
      if (this.onChange) {
        this.onChange(file, fileList);
      }
    },
    handleDragStart(event) {
      this.$emit('input', this.fileList)
      this.$emit('change', {
        value: this.fileList,
        res: {}
      })
      this.$emit('drag-start', event, this.fileList)
    },
    handleDragEnd(event) {
      this.$emit('input', this.fileList)
      this.$emit('change', {
        value: this.fileList,
        res: {}
      })
      this.$emit('drag-end', event, this.fileList)
    },
    submit() {
      this.$refs.tyUploadFile.submit();
    }
  }
};
</script>

<style lang="scss" scoped>
.ty-upload-file {
  ::v-deep .el-upload-list__item-name {
    .el-input__inner {
      margin-top: 5px;
    }
  }

  .el-upload__list {
    text-align: left;

    .el-upload-list__item-name {
      text-decoration: none;
    }
  }

  ::v-deep .errorFont .el-upload-list__item-name {
    color: #f00;

    .el-input__inner {
      border: 1px solid #f00;
      color: #f00;
    }
  }
}

</style>
