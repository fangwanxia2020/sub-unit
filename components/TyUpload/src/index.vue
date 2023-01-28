<template>
  <div class="ty-upload">
    <template v-if="isAvatar">
      <el-upload
        :disabled="disabled"
        :accept="'image/*'"
        :http-request="_uploadImg"
        :action="UploadUrl()"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload.stop="beforeUploadHandle"
      >
        <slot>
          <div class="avatar-uploader el-upload-list--picture-card">
            <div v-if="value">
              <el-image
                :src="value"
                :style="{ width: (width||'100') + 'px', height: (height||'100' )+ 'px', lineHeight: (height||'100' )+ 'px'}"
                class="avatar"
                fit="cover"
              ></el-image>
              <span
                class="el-upload-list__item-actions"
                v-if="(isShow || (!disabled && isDelete))"
              >
                <span
                  v-if="isShow"
                  class="el-upload-list__item-preview"
                  @click.stop="handlePictureCardPreview(value)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled && isDelete"
                  class="el-upload-list__item-delete"
                  @click.stop="handleRemove"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              :style="{ width: (width||'100') + 'px', height: (height||'100' )+ 'px', lineHeight: (height||'100' )+ 'px'}"
            ></i>
          </div>
        </slot>
      </el-upload>
      <slot name="tip"></slot>
    </template>
    <div v-else>
      <div class="itemContent">
        <draggable
          v-model="fileList"
          class="el-upload-list el-upload-list--picture-card"
          tag="ul"
          v-bind="dragOptions"
          @start="handleDragStart"
          @end="handleDragEnd"
          filter=".forbid"
        >
          <div
            v-for="(file,index) in fileList"
            :key="index"
            v-loading="loadingapp"
            class="el-upload-list__item is-success"
          >
            <div>
              <div
                class="el-upload-list__item-Box"
                :style="{ width: (width||'100') + 'px', height: (height||'100' )+ 'px'}"
              >
                <el-image
                  :src="changeUrl(file)"
                  class="el-upload-list__item-thumbnail"
                  fit="cover"
                ></el-image>
              </div>
              <span
                class="el-upload-list__item-actions"
                v-if="length >= 1 && ((isShow && changeUrl(file)) || (!disabled && isDelete))"
              >
                <span
                  v-if="isShow && changeUrl(file)"
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled && isDelete"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </div>
          <el-upload
            class="forbid el-upload-list__item"
            :http-request="_uploadImg"
            :accept="'image/*'"
            :disabled="disabled"
            :multiple="multiple"
            :limit="length"
            :action="UploadUrl()"
            list-type="picture-card"
            :file-list.sync="fileList"
            :on-success="handleSuccess"
            :before-upload="beforeUploadHandle"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :before-remove="beforeRemoveFun"
            :show-file-list="false"
          >
            <slot name="trigger">
              <div
                class="el-upload-add"
                slot="default"
                v-if="(fileList.length<length)"
                :style="{ width: (width||'100') + 'px', height: (height||'100' )+ 'px', lineHeight: (height||'100' )+ 'px'}"
              >
                <i class="el-icon-plus"></i>
              </div>
            </slot>
            <!-- <div
            slot="file"
            slot-scope="{file}"
          >
            <div v-if="['','success'].indexOf(file.status)>=0">
              <div
                class="el-upload-list__item-Box"
                :style="{ width: (width||'100') + 'px', height: (height||'100' )+ 'px'}"
              >
                <el-image
                  :src="file.url"
                  class="el-upload-list__item-thumbnail"
                  fit="cover"
                ></el-image>
              </div>
              <span
                class="el-upload-list__item-actions"
                v-if="(length&&length>=1)&&(isShow || ((!disabled)&&isDelete))"
              >
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                  v-if="isShow"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="(!disabled)&&isDelete"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </div> -->
            <!-- <div
            class="el-upload__tip"
            slot="tip"
          >
            <slot name="tip"></slot>
          </div> -->
          </el-upload>
        </draggable>
      </div>
      <slot name="tip"></slot>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <img
        width="100%"
        :src="dialogImageUrl"
        alt
      />
    </el-dialog>
  </div>
</template>
<script>
/**
 * 组件名称 TyUpload
 * @module components/form/TyUpload
 * @desc el-upload 二次封装,支持图片的预览，删除，让上传图片代码统一，避免项目代码的重复编写
 * @author lyt
 * @date 2020年06月09日 15:00
 * @param {String} [action]    - 上传图片地址
 * @param {Boolean} [multiple] - 是否支持多张图片上传
 * @param {Array} [value]    - 上传组件的值
 * @param {[String, Number]} [width] - 宽度
 * @param {[String, Number]} [height] - 高度
 * @param {[String, Number]} [imgMaxSize] - 允许上传图片的大小MB
 * @param {[String, Number]} [length]    - 允许上传图片的个数
 * @param {Boolean} [disabled] - 不可编辑
 * @param {Boolean} [isShow]    - 查看
 * @param {Boolean} [isDelete] - 删除
 * @example 调用示例
 *  <ty-upload
    v-model="uploadVal"   
    action="/common/uploadOss"
    :length="5"
    :width="100"
    :height="100"
    :disabled="false"
    :isShow="true"
    :isDelete="true"        
  >
  </ty-upload>
 **/
import draggable from "vuedraggable";
import {
  uploadIMG
}
from "./api";
import Clipper from './clipper.js';
//裁剪图片
let clipper = '';
export default {
  name: "TyUpload",
  props: {
    //是否是上传头像
    isAvatar: {
      type: Boolean,
      default: false
    },
    action: {
      //上传图片地址
      type: String,
      default: ""
    },
    //请求参数
    //  fileType 上传文件类型
    //  1为图片，2为文件，3为导入商品专用zip
    //  fileUseType 文件使用类型
    //  1为头像2产品图片3空间动态4销售品图片5公用,还有其他 
    actionParams: {
      default: () => {}
    },
    //上传图片时的裁剪比例，默认1,传16/9时，按16:9裁剪,false为不用裁切
    aspectRatio: {
      default: false
    },
    multiple: {
      //是否支持多张图片上传
      type: Boolean,
      default: false
    },
    value: {
      //上传组件的值
      type: [Array, String]
    },
    width: {
      //宽度
      type: [String, Number],
      default: "100"
    },
    height: {
      //高度
      type: [String, Number],
      default: "100"
    },
    imgMaxSize: {
      //允许上传图片的大小MB
      type: [String, Number],
      default: 10
    },
    length: {
      //允许上传图片的个数
      type: [String, Number],
      default: 8
    },
    disabled: {
      //不可编辑
      type: Boolean,
      default: false
    },
    isShow: {
      //查看
      type: Boolean,
      default: true
    },
    isDelete: {
      //删除
      type: Boolean,
      default: true
    },
    resFormat: {
      //上传后端接口数据获取格式
      type: String,
      default: ''
    },
    needToken: {
      // 接口是否需要token
      type: Boolean,
      default: true
    },
    returnArrayString: {
      // 多图片是否只返回字符串数组
      type: Boolean,
      default: false
    },
    //图片格式 
    imgSuffixs:{
      type:Array,
      default:()=> ["gif", "png", "jpg", "jpeg", "dwg", "dwl", "dxf"]
    }
  },
  components: {
    draggable,
  },
  data() {
    const value = this.value || [];
    return {
      drag: false, //是否拖拽
      loadingapp: false,
      fileList: value,
      dialogImageUrl: "",
      dialogVisible: false,
      fileSuffixs:this.imgSuffixs
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    changeUrl(){
      return (file)=>{
        if(this.returnArrayString) {
          return file
        } else {
          return file.url
        }
      }
    }
  },
  watch: {
    //解决填充值的时候值没有赋值上去导致图片没显示出来的问题
    value() {
      this.fileList = this.value;
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
    //请求后端数据
    _uploadImg(item) {
      const files = item.file;
      let formData = new FormData();
      let paramsObj = this.actionParams || {};
      if (paramsObj && (typeof paramsObj == "string")) {
        paramsObj = JSON.parse(paramsObj);
      }
      for (var key in paramsObj) {
        formData.append([key], paramsObj[key]);
      }
      //需要裁切图片
      if (this.aspectRatio) {
        if (!clipper) {
          clipper = new Clipper()
        }
        let reader = new FileReader();
        let aspectRatio = this.aspectRatio;
        const self = this;
        reader.onload = function(e) {
          let data = e.target.result;
          //加载图片获取图片真实宽度和高度，异步操作
          let image = new Image();
          image.onload = function() {
            let width = image.width;
            let height = image.height;
            //（宽度/高度-比例）绝对值大于0.1时进行裁剪
            if (Math.abs((width / height) - aspectRatio) > 0.1) {
              //不满足比例，需进行裁剪
              clipper.clip(files, {
                aspectRatio: aspectRatio
              })
              // 回调函数
              clipper.confirm(function(file, $this) {
                if (self.imgMaxSize && self.imgMaxSize > 0) {
                  const isLt2M = file.size / 1024 / 1024 < self.imgMaxSize;
                  if (!isLt2M) {
                    self.$message.error(`图片大小必须少于 ${self.imgMaxSize}MB!`);
                    return false;
                  }
                }
                return self.postUploadIMGFun(formData, file);
              }, self)
            }
            else {
              if (self.imgMaxSize && self.imgMaxSize > 0) {
                const isLt2M = files.size / 1024 / 1024 < self.imgMaxSize;
                if (!isLt2M) {
                  self.$message.error(`图片大小必须少于 ${self.imgMaxSize}MB!`);
                  return false;
                }
              }
              self.postUploadIMGFun(formData, files);
            }
          };
          image.src = data;
        };
        reader.readAsDataURL(files);
        //图片先进行裁剪
        return;
      }
      this.postUploadIMGFun(formData, item.file);
    },
    postUploadIMGFun(formData, file) {
      formData.append("file", file);
      const paramsObj = this.actionParams || {};
      if (paramsObj.fileType && paramsObj.fileType == 3) {
        formData.append("zipFile", file);
      }
      return uploadIMG(this.action, formData, this.needToken).then(response => {
        let data = response;
        if (this.resFormat) {
          const bb = this.resFormat.split(".");
          bb.forEach(i => {
            data = data[i];
          });
        }
        const {
          fileUrl,
          url,
          fileName,
          fileId,
          downloadUrl,
          name,
          id
        } = data[0] || data || {};
        const fileData = {
          url: fileUrl || url ||downloadUrl,
          name: fileName ||name,
          id: fileId||id,
          res: (data[0] || data || {})
        };
        if (this.isAvatar) {
          this.$emit("input", fileData.url);
          this.$emit("change", {
            value: fileData.url,
            res: data,
            file: file
          });
        }
        else {
          console.log(this.returnArrayString)
          if(this.returnArrayString) {
            this.fileList.push(fileData.url);
          } else {
            this.fileList.push(fileData);
          }
          this.$emit("input", this.fileList);
          this.$emit("change", {
            value: this.fileList,
            res: data,
            file: file
          });
        }
      }).catch(error => {
        this.$message.error("上传失败，请重新上传");
      });
    },
    // 上传前拦截, 注意会触发handleChange
    beforeUploadHandle(file) {
      try {
        if (this.imgMaxSize && this.imgMaxSize > 0) {
          const isLt2M = file.size / 1024 / 1024 < this.imgMaxSize;
          if (!isLt2M) {
            this.$message.error(`图片大小必须少于 ${this.imgMaxSize}MB!`);
            return false;
          }
        }
        const includes = this.fileSuffixCheck(file);
        const suffixList = this.fileSuffixs;
        if (!includes) this.$message.error(`请您上传正确的照片类型。如${suffixList.join("、")}`);
        return includes;
      }
      catch (e) {
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
    //上传路径
    UploadUrl() {
      return this
      .action; //"https://jsonplaceholder.typicode.com/posts/"; //`${process.env.BASE_API}/base/fus/uploadFile`;
    },
    //上传成功
    handleSuccess(res, file, fileList) {
      //alert("sucesss");
      // console.log(file, "sucess");
    },
    //移除图片
    handleRemove(file, fileList) {
      if(this.isAvatar) {
        this.$emit("input", '');
        this.$emit("change", {
          value: '',
          res: null,
          file: ''
        });
      } else {
        this.fileList.splice(this.fileList.findIndex(item => item === file), 1);
        this.$emit("input", this.fileList);
        this.$emit("change", {
          value: this.fileList,
          res: {},
          file: file
        });
      }
    },
    //预览
    handlePictureCardPreview(file) {
      if(this.returnArrayString || this.isAvatar) {
        this.dialogImageUrl = file;
      } else {
        this.dialogImageUrl = file.url;
      }
      this.dialogVisible = true;
    },
    //下载
    handleDownload(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      console.log(file, "change", fileList);
    },
    handleDragStart() {
      this.drag = true
      this.$emit('input', this.fileList)
      this.$emit('drag-start', this.fileList)
    },
    handleDragEnd() {
      this.drag = false
      this.$emit('input', this.fileList)
      this.$emit('drag-end', this.fileList)
    }
  }
};

</script>
<style lang="scss">
.clipper_img {
  width: 200px;
  height: 200px;
}

.clipper_input {
  display: none;
}

#clip_button {
  position: absolute;
  right: 10%;
  bottom: 20px;
  width: 80px;
  height: 40px;
  border: none;
  border-radius: 2px;
  background: #419EF7;
  color: #fff;
}

#clip_button:active {
  background: #2879c5;
}

#cancel_clip {
  position: absolute;
  left: 10%;
  bottom: 20px;
  width: 80px;
  height: 40px;
  border: none;
  border-radius: 2px;
  color: #fff;
  background: #b1b1b1;
}

#cancel_clip:active {
  background: #908f8f;
}

#clip_container.container {
  z-index: 3999;
  position: fixed;
  padding-top: 60px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  transition: opacity 0.2s;
}

#clip_container.remove {
  opacity: 0;
}

#clip_container.container>div {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

#clip_image {
  max-width: 100%;
}

.cropper-container {
  font-size: 0;
  line-height: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none
}

.crop_loading,
.crop_success {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}

.crop_loading .crop_content {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  background: #000;
  opacity: 0.9;
  height: 100px;
  width: 100px;
  vertical-align: middle;
  color: #fff;
  padding-top: 20px;
  font-size: 16px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.crop_loading .crop_content img {
  margin-top: 15px;
  margin-bottom: 10px;
}

.crop_success .crop_success_text {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  background: #000;
  opacity: 0.9;
  width: 120px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  font-size: 16px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: .5;
  background-color: #000;
}

.cropper-view-box {
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
  position: absolute;
  display: block;
  opacity: .5;
  border: 0 dashed #eee
}

.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px
}

.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px
}

.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0;
  height: 0;
  opacity: .75
}

.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: ' ';
  background-color: #eee
}

.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px
}

.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px
}

.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  opacity: .1;
}

.cropper-face {
  top: 0;
  left: 0;
  background-color: #fff;
}

.cropper-line {
  background-color: #39f
}

.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize
}

.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize
}

.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize
}

.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize
}

.cropper-point {
  width: 5px;
  height: 5px;
  opacity: .75;
  background-color: #39f
}

.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize
}

.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize
}

.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize
}

.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize
}

.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize
}

.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize
}

.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize
}

.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1
}

@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px
  }
}

@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px
  }
}

@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: .75
  }
}

.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: ' ';
  opacity: 0;
  background-color: #39f
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.cropper-hide {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}

.uploadLoading {
  height: 60px;
}

</style>
<style
  lang="scss"
  scoped
>
.avatar {
  vertical-align: top;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  /* overflow: hidden; */
  display: inline-block;
  img {
    vertical-align: middle;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.ty-upload ::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: auto;
  height: auto;
  border: 0;
  margin-top: 0;
}

.ty-upload ::v-deep .el-upload--picture-card {
  width: auto;
  height: auto;
  line-height: 0;
  border: 0;

  .el-upload-add {
    border: 1px solid #ddd;
  }
}

.ty-upload ::v-deep .el-upload-list__item-Box {
  position: relative;
  border: 1px solid #ddd;

  .el-upload-list__item-Box-loading {
    position: absolute;
    font-size: 40px;
    left: 50%;
    top: 50%;
    margin: -20px 0 0 -20px;
    color: #fff;
  }
}

.ty-upload ::v-deep {

  .el-image__error,
  .el-image__inner,
  .el-image__placeholder {
    width: 100%;
    min-height: 100%;
    height: auto;
  }
}

.divBox {
  /*flex-direction: row;*/
  float: left;
  position: relative;
}

.itemContent {
  display: flex;
}

</style>
