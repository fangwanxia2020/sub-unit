<template>
  <div
    :class="{fullscreen:fullscreen}"
    class="ty-editor"
    :style="{width:containerWidth}"
  >
    <div v-html="value"></div>
    <textarea
      :id="tinymceId"
      class="ty-editor__textarea"
    /> </div>
</template>
<script>
/**
 * 组件名称 TyEditor
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
export default {
  name: "TyEditor2",
  components: {
    TyUpload
  },
  props: {
     action: {
      //上传图片地址
      type: String,
      default:"/common/uploadOss"
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
    }
  },
  data() {
    return {      
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false
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
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
        );
      }
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
    init() {
      if (window.tinymce) {    
          this.initTinymce();
         return
      }
      loadScript(
        "https://cdn.jsdelivr.net/gh/liuyting/weiyu@0.1.0/tinymce5.4.1/tinymce.min.js",
        () => {
          this.initTinymce();
        }
      );
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
      selector: `#${this.tinymceId}`,
      language: 'zh_CN',
      statusbar: false,
      lineheight_formats: '1 1.5 1.75 2 3 4 5',
      font_formats: '宋体=宋体;微软雅黑=微软雅黑;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
      height: this.height,
      body_class: 'panel-body ',
      object_resizing: false,
      toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
      menubar: this.menubar,
      plugins: [...plugins],
      powerpaste_allow_local_images: true,//允许带图片
      end_container_on_empty_block: true,
      paste_enable_default_filters:false,
      paste_data_images: true,
      powerpaste_word_import: 'merge', // 参数可以是propmt, merge, clear
      powerpaste_html_import: 'merge', // propmt, merge, clear
      code_dialog_height: 450,
      code_dialog_width: 1000,
      default_link_target: '_blank',
      paste_merge_formats: false,
      link_title: false,
      automatic_uploads: true,
      resize: false,
              setup(editor) {
            editor.on("FullscreenStateChanged", e => {
              _this.fullscreen = e.state;
            });
          },
      convert_urls: false,
      init_instance_callback: editor => {
          if (_this.value) {
          editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
          this.hasChange = true
          this.$emit('input', editor.getContent())
          })
      },
      images_upload_handler:  (blobInfo, success, failure)=> {
        // 这个函数主要处理word中的图片，并自动完成上传；
          let formData = new FormData();
              formData.append("fileType", 1);
              formData.append("fileUseType", 2);
              formData.append("file",blobInfo.blob(),blobInfo.filename());
              uploadIMG(this.action, formData)
                .then(data => {
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
      paste_enable_default_filters:false,
     })
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
</style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    