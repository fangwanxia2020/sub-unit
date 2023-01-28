<template>
  <div
    :class="{fullscreen:fullscreen}"
    class="ty-editor"
    :style="{width:containerWidth}"
  >
    <div :class="[disabled?'disable':'']">
      <textarea
        :id="tinymceId"
        class="ty-editor__textarea"
      /> <div class="ty-editor__btnwrap" v-show="false">
      
        <ty-upload v-model="uploadImg" :action="action" :actionParams="actionParams" :imgMaxSize="imgMaxSize" :resFormat="resFormat" @change="changeImage">
          <i class="el-icon-picture-outline" slot="trigger" :id="jsUploadImgId"></i>
        </ty-upload> 
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 组件名称 TyEditor 4.9版本
 * @module components/form/TyDictionary
 * @desc 编辑器
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {String} [id]    - 编辑器id
 * @param {String} [value] - 默认值
 * @param {Array} [toolbar] - 工具栏
 * @param {String} [menubar] - 菜单栏
 * @param {Number, String} [height] - 高度
 * @param {Number, String} [width] - 宽度
 * @example 调用示例
 *  <ty-editor v-model="content" :height="300"></ty-editor>
 **/
import TyUpload from "components/TyUpload";
import { uploadIMG } from "components/TyUpload/src/api";
import plugins from "./plugins";
import toolbar from "./toolbar";
import loadScript from "utils/loadScript";
import { Loading } from 'element-ui';

export default {
  name: "TyEditor",
  components: {
    TyUpload
  },
  props: {
     action: {
      //上传图片地址
      type: String,
      default:"/common/uploadOss"
    },
    //上传图片参数
     actionParams: {
      default: () => {}
    },
    imgMaxSize: {
      //允许上传图片的大小MB
      type: [String, Number],
      default: 2
    },
    resFormat: {
      //上传后端接口数据获取格式
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: function() {
        return (
          "vue-tinymce-" +
          +new Date().getTime() +Math.floor(Math.random()*10)+""
        );
      }
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      type: String,
      default: "file edit insert view format table"
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto"
    },
    disabled: {
      //不可编辑
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      uploadImg: [],
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      jsUploadImgId: `jsUploadImg${this.id}`,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja"
      }
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    }
  },
  watch: {
    value(val) {
      if (this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
         );
      }
    },
    uploadImg(val) { 
      val && val.length > 0 && this.imageSuccessCBK(val);
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    changeImage(){
       
    },
    init() {
      if (window.tinymce) {  
          this.initTinymce();
         return
      }
      loadScript(
        // "https://cdn.staticfile.org/tinymce/4.9.2/tinymce.min.js",
        "https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/tinymce/4.9.2/tinymce.min.js",
        // "https://unpkg.com/tinymce-all-in-one@4.9.3/tinymce.min.js",
        // "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js",
        () => {
          this.initTinymce();
        }
      );
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        fontsize_formats: "12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px", // 字体大小选择
        font_formats:
           "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';Verdana=Verdana;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica",
        statusbar: false,
        selector: `#${this.tinymceId}`,
        disabled:true,
        language: 'zh-Hans',
        language_url:require('./zh-Hans.js'),
        height: this.height,
        body_class: "panel-body ",
        object_resizing: true,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        external_plugins: {
          'powerpaste': `https://cbos1.tianyuaninternet.com/web/powerpaste/plugin.min.js`
          // 'powerpaste': `https://cdn.jsdelivr.net/gh/liuyting/weiyu@0.0.5/powerpaste/plugin.min.js`
          // 'powerpaste': `http://web.huadengkeji.com/web/powerpaste/plugin.min.js`
        },
        plugins: [...plugins,'powerpaste'],
        powerpaste_word_import: 'merge', // 参数可以是propmt, merge, clear
        powerpaste_html_import: 'merge', // propmt, merge, clear
        powerpaste_allow_local_images: true,//允许带图片
        end_container_on_empty_block: true,
        paste_enable_default_filters:false,
        paste_data_images: true,
        
        images_upload_handler:  (blobInfo, success, failure)=> {
          // 这个函数主要处理word中的图片，并自动完成上传；
            let formData = new FormData();
                formData.append("fileType", 1);
                formData.append("fileUseType", 2);
                formData.append("file",blobInfo.blob(),blobInfo.filename());
                uploadIMG(this.action, formData)
                  .then(data => {
                    if (this.resFormat) {
                      const bb = this.resFormat.split(".");
                      bb.forEach(i => {
                        data = data[i];
                      });
                    }
                    const { fileUrl, url, fileName, fileId } = data[0] || data || {};
                    const fileData = {
                      url: fileUrl || url,
                      name: fileName,
                      id: fileId
                    };
                    // 上传成功后，调用success函数传入图片地址
                    success(fileData.url)
                  })
                  .catch(error => {
                    this.$message.error("上传失败，请重新上传");
                  });
        },
        file_picker_types: "media",
        //自定义文件选择器的回调内容 此方法只有在点击上方图片按钮才会触发
        //编辑器回显video被img覆盖问题的解决方法 https://www.jianshu.com/p/9f586d4b02d0
        /**
        * @param {Function} [callback] - 上传成功后，调用callback函数传入视频地址
         * @param {Object} [value] 
         * @param {Object} [meta] - 视频的详细信息
         */
        file_picker_callback: (callback, value, meta)=> {
            // 主要判断 media 
            if (meta.filetype === 'media') {
            // 动态创建上传input，并进行模拟点击上传操作，达到本地上传视频效果。
            let input = document.createElement('input');//创建一个隐藏的input
              input.setAttribute('type', 'file');
              input.setAttribute("accept", ".mp4");
              let that = this
              input.onchange = function(){
                let loading = Loading.service({
                  lock: true,
                  text: '上传中',
                  spinner: 'el-icon-loading',
                  background: 'rgba(255, 255, 255, 0.7)',
                  customClass: 'create-isLoading'
                });
                  //this.files[0].size 可以做大小限制
                  let file = this.files[0];
                  let fd = new FormData();
                  fd.append("file", file);
                   uploadIMG(that.action, fd)
                .then(data => {
                  const { fileUrl, url, fileName, fileId } = data.data || {};
                  loading && loading.close();
                  callback(url)
                })
                .catch(error => {
                  loading && loading.close();
                   that.$message({
                    message: '上传失败，请重新上传',
                    type: 'error',
                    customClass: 'create-isLoading'
                  });
                });
              }
              //触发点击
              input.click();
            }
        },
        media_url_resolver: function(data, resolve) {
          try {
            // let videoUri = encodeURI(data.url);
            let videoUri = data.url;
            let embedHtml = `<p>
                 <span
                data-mce-selected="1"
                data-mce-object="video"
                data-mce-p-controls="controls"
                data-mce-p-controlslist="nodownload"
                data-mce-p-allowfullscreen="true"
                style="width: 200px;height:120px;display: block;"
                data-mce-p-src=${videoUri} >
                <video src=${videoUri} width="100%" height="100%" controls="controls" controlslist="nodownload">
                </video>
              </span>
                </p>
                <p style="text-align: left;"></p>`;
            resolve({ html: embedHtml });
          } catch (e) {
            resolve({ html: "" });
          }
        },
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles:"default,circle,disc,square",
        advlist_number_styles:"default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;            
          });
          editor.on("blur", () => {
            this.$emit("input",editor.getContent());
          });          
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", e => {
            _this.fullscreen = e.state;
          });

          editor.addButton("example", {
            title: "上传图片",
            icon: "image",
            onclick: () => {
              // document.getElementById("jsUploadImg").click();
              document.getElementById(_this.jsUploadImgId).click();
            }
          });
        },
        convert_urls: false
      });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {   
      const _this = this;  
      arr.forEach(v => {     
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
      this.uploadImg = [];
    }
  }
};
</script>
<style lang="less">
.ty-editor {
  .mce-container,
  .mce-container *,
  .mce-widget,
  .mce-widget *,
  .mce-reset {
    white-space: normal !important;
  }
}
.create-isLoading {
    z-index: 555555!important;//加载会被编辑器弹窗覆盖
  }
</style>
<style scoped lang="less">
.ty-editor {
  position: relative;
  line-height: normal;
}
.ty-editor /deep/ .mce-fullscreen {
  z-index: 10000;
}
.ty-editor__textarea {
  visibility: hidden;
  z-index: -1;
}
.ty-editor__btnwrap {
  position: absolute;
  right: 4px;
  top: 4px;
}
.fullscreen .ty-editor__btnwrap {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
.disable{
  position:relative;
  left:0;
  top:0;
  opacity:.5;
  width:100%;
  height:300rpx;
  background:#000;
  z-index:998;
  /*pointer-events: none; 是可以点击下面的事件，但是因为div是包着tinymac的，所以无效 */
  pointer-events: none;
}
</style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    