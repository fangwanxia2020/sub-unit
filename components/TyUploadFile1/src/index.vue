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

    <!-- 进度条 -->
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
 * 上传文件组件
 * @module TyUploadFile
 * @author lyt
 * @date 2020年06月09日 15:00
 * @vue-prop {Object[]} [value] 上传组件的值(v-model)
 * @vue-prop {boolean} [showUploadList] 是否显示上传列表
 * @vue-prop {boolean} [showUrl] 是否显示 url
 * @vue-prop {Object} [actionParams] 请求参数
 * @vue-prop {string} [action] 上传文件地址
 * @vue-prop {boolean} [multiple] 是否支持多文件上传
 * @vue-prop {string|number} [fileMaxSize] 允许上传文件的大小MB
 * @vue-prop {stringnumber} [length] 允许上传文件的个数
 * @vue-prop {boolean} [disabled] 禁用状态
 * @vue-prop {string} [width] 宽度
 * @vue-prop {string|string[]} [fileSuffixs] 允许上传的文件类型 ()=>["gif", "png", "jpg", "jpeg", "dwg", "dwl", "dxf"]
 * @vue-prop {boolean} [isDownLoad] 是否能下载，默认是true,isDownLoad为false时触发emit handleFile方法并返回文件数据
 * @vue-prop {boolean} [isDelete] 是否能删除
 * @vue-prop {string} [uploadFileText] 上传按钮文本
 * @vue-prop {string} [resFormat] 上传后端接口数据获取格式
 * @vue-prop {Function} [beforeUpload] 上传前拦截函数，抛错会中断上传
 * @vue-prop {Function} [onChange] 上传文件数据变化时回调
 * @vue-prop {boolean} [autoUpload] 是否在选取文件后立即进行上传
 * @vue-prop {boolean} [needToken] 接口是否需要token
 * @vue-prop {Function} [onSuccess] 文件上传成功时的钩子
 * @vue-prop {Function} [httpRequest] 覆盖默认的上传行为，可以自定义上传的实现
 * @vue-prop {string} [method] 请求方法
 * @vue-prop {number} [timeout] 上传接口的超时时间ms
 * @vue-prop {boolean} [isDraggable=true] 是否可拖拽
 * @vue-event {Object} input 修改文件事件(v-model)
 * @vue-event {Object} change 修改文件事件
 * @example <caption>调用示例</caption>
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
      //显示url的模式
      type: Boolean,
      default: false
    },
    //请求参数
    //  fileType 上传文件类型
    //  1为图片，2为文件，3为导入商品专用zip
    //  fileUseType 文件使用类型
    //  1为头像2产品图片3空间动态4销售品图片5公用,还有其他
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
      //宽度
      type: String,
      default: "300px"
    },
    fileSuffixs: {
      default: "all"
    },
    isDownLoad: {
      //下载
      type: Boolean,
      default: true
    },
    isDelete: {
      //删除
      type: Boolean,
      default: true
    },
    uploadFileText: {
      type: String,
      default: "点击上传"
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
      default: 600 * 1000  // 默认 10 分钟
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
    //解决填充值的时候值没有赋值上去导致文件没显示出来的问题
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
    //删除文件前
    beforeRemoveFun() {
      if ((!this.disabled) && this.isDelete) {
        return true;
      }
      return false;
    },
    //下载文件
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
    //上传文件
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
        // 上传失败事件
        this.$emit('upload-error', e);
        setTimeout(() => {
          this.percentage = 0;
          this.progress = false;
        }, 1000);
      })
    },
    // 上传前拦截, 注意会触发handleChange
    beforeUploadHandle(file) {
      try {
        //限制文件大小
        if (this.fileMaxSize && this.fileMaxSize > 0) {
          const isLt2M = file.size / 1024 / 1024 < this.fileMaxSize;
          if (!isLt2M) {
            this.$message.error(`文件大小必须少于 ${this.fileMaxSize}MB!`);
            return false;
          }
        }
        //限制文件类型
        if (this.fileSuffixs != "all") {
          const includes = this.fileSuffixCheck(file);
          const suffixList = this.fileSuffixs;
          if (!includes) {
            this.$message.error(`请您上传正确的文件类型。如${suffixList.join("、")}`);
            return false;
          }
        }
        // autoUpload 不为 false 时才会调用
        if (this.beforeUpload) {
          this.beforeUpload(file);
        }
        return true;
      } catch (e) {
        console.error("文件上传异常", e);
        return false;
      }
    },
    //限制长度
    handleExceed(files, fileList) {
      this.$message.error(`当前限制选择 ${this.length}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //文件后缀检验
    fileSuffixCheck(file) {
      const {
        name
      } = file;
      const nameArr = name.split(".");
      // 小写后缀
      const suffix = nameArr[nameArr.length - 1].toLowerCase();
      const suffixList = this.fileSuffixs;
      return suffixList.includes(suffix);
    },
    //上传成功
    handleSuccess(res, file, fileList) {
      if (this.onSuccess) {
        this.onSuccess(res, file, fileList);
      }
    },
    //上传失败
    handleError(err, file, fileList) {
      console.log(err);
      console.log(file);
    },
    //移除文件
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
        //IE浏览器保存文本框内容
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
