<template>
  <div
    :class="['code-edit-box',type=='pc'?'pc':'mobile']"
    :style="{height:`${height}`}"
  >
    <el-row style="height:100%;overflow:auto">
      <el-col
        :md="24"
        :lg="12"
        class="code-edit-box__left"
      >
        <el-tabs
          v-model="activeTab"
          type="card"
          class="code-edit-box__left__tabs"
        >
          <el-tab-pane name="html">
            <span slot="label">
              <i
                v-if="activeTab==='html'"
                class="el-icon-edit"
              />
              <i
                v-else
                class="el-icon-document"
              /> template </span>
          </el-tab-pane>
          <el-tab-pane name="js">
            <span slot="label">
              <i
                v-if="activeTab==='js'"
                class="el-icon-edit"
              />
              <i
                v-else
                class="el-icon-document"
              /> script </span>
          </el-tab-pane>
          <el-tab-pane name="css">
            <span slot="label">
              <i
                v-if="activeTab==='css'"
                class="el-icon-edit"
              />
              <i
                v-else
                class="el-icon-document"
              /> css </span>
          </el-tab-pane>
        </el-tabs>
        <div
          v-show="activeTab==='html'"
          :id="`editorHtml${id}`"
          class="code-edit-box__left__tabs__editor"
        />
        <div
          v-show="activeTab==='js'"
          :id="`editorJs${id}`"
          class="code-edit-box__left__tabs__editor"
        />
        <div
          v-show="activeTab==='css'"
          :id="`editorCss${id}`"
          class="code-edit-box__left__tabs__editor"
        />
      </el-col>
      <el-col
        :md="24"
        :lg="12"
        class="code-edit-box__right"
      >
        <div
          class="code-edit-box__right__btn"
          :style="{'text-align': 'left'}"
        >
          <span
            class="bar-btn"
            @click="runCode"
          >
            <i class="el-icon-refresh" /> 刷新 </span>
          <span
            class="bar-btn"
            @click="exportFile"
          >
            <i class="el-icon-download" /> 导出vue文件 </span>
          <span
            ref="copyBtn"
            class="bar-btn copy-btn"
          >
            <i class="el-icon-document-copy" /> 复制代码 </span>
        </div>
        <div class="code-edit-box__right__scrollbox">
          <div v-if="type=='pc'">
            <div :id="`previewApp${id}`"></div>
          </div>
          <div v-if="type=='mobile'">
            <div class="h5-viwer-box">
              <iframe
                v-if="iframeShow"
                ref="previewPage"
                class="result-wrapper h5-viwer"
                frameborder="0"
                :src="mobileUrl"
                @load="iframeLoad"
                id="h5-viwer"
                width="414"
                height="736"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/**
 * 组件名称 TyCodeEdit
 * @module components/data/TyCodeEdit
 * @desc 代码编辑预览组件
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Object} [data]    - 编辑器中的代码
 * @param {String} [mobileUrl] - 手机模式下的预览地址
 * @param {String} [type] - 编辑器的预览模式：pc 或者 mobile
 * @param {String} [height] - 编辑器的高度
 * @example 调用示例
 *  <ty-code-edit :data="codeData" type="mobile"></ty-code-edit>
 **/
import VueRouter from "vue-router";
//import { parse } from "@babel/parser";
import ClipboardJS from "clipboard";
import {
  saveAs
}
from "file-saver";
import {
  vueTemplate,
  vueScript,
  cssStyle
}
from "./generator/html";
import {
  exportDefault,
  beautifierConf,
  titleCase
}
from "./utils/index";
import loadMonaco from "./utils/loadMonaco";
import loadBeautifier from "./utils/loadBeautifier";
const router = new VueRouter({
  routes: []
});
const mode = {
  html: "html",
  js: "javascript",
  css: "css"
};
let beautifier;
export default {
  name: "TyCodeEdit",
  props: {
    id: {
      type: String,
      default: function() {
        return new Date().getTime().toString();
      }
    },
    //编辑器中的代码
    data: {
      type: Object,
      default: () => {
        return {
          html: "",
          script: "",
          css: ""
        };
      }
    },
    //手机模式下的预览地址
    mobileUrl: {
      type: String,
      default: "http://127.0.0.1:8080"
    },
    //编辑器的预览模式：pc 或者 mobile
    type: {
      type: String,
      default: "pc"
    },
    //编辑器的高度
    height: {
      type: String,
      default: "500px"
    }
  },
  data() {
    return {
      iframeShow: false,
      clipboard: null,
      activeTab: "html",
      htmlCode: "",
      jsCode: "",
      cssCode: "",
      codeFrame: "",
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      scripts: [],
      links: [],
      isIframeLoaded: false,
      editorObj: {
        html: null,
        js: null,
        css: null
      }
    };
  },
  computed: {},
  watch: {
    data: {
      handler: function(val) {},
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.iframeShow = true;
    }, 100);
    window.addEventListener("keydown", this.preventDefaultSave);
    //复制代码
    this.clipboard = new ClipboardJS(".copy-btn", {
      text: trigger => {
        const codeStr = this.generateCode();
        this.$notify({
          title: "成功",
          message: "代码已复制到剪切板，可粘贴。",
          type: "success"
        });
        return codeStr;
      }
    });
    this.clipboard.on("error", e => {
      this.$message.error("代码复制失败");
    });
    this.onOpen();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.preventDefaultSave);
    this.onClose();
    this.clipboard.destroy();
  },
  methods: {
    //表单的值发生变化触发的事项
    handleDataChange(field, value, data) {
      console.log(field, value, data);
    },
    preventDefaultSave(e) {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    },
    onOpen() {
      this.htmlCode = this.data.html;
      this.jsCode = this.data.script;
      this.cssCode = this.data.css;
      loadBeautifier(btf => {
        beautifier = btf;
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html);
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js);
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html);
        loadMonaco(val => {
          window.monaco = val;
          this.setEditorValue("editorHtml" + this.id, "html", this.htmlCode);
          this.setEditorValue("editorJs" + this.id, "js", this.jsCode);
          this.setEditorValue("editorCss" + this.id, "css", this.cssCode);
          if (!this.isInitcode) {
            this.isRefreshCode = true;
            if (this.type == "pc") {
              (this.isInitcode = true) && this.runCode();
            }
            else {
              this.isIframeLoaded && (this.isInitcode = true) && this.runCode();
            }
          }
        });
      });
    },
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true;
        this.isRefreshCode && (this.isInitcode = true) && this.runCode();
      }
    },
    setEditorValue(id, type, codeStr) {
      if (!window.monaco) return;
      this.editorObj[type] = window.monaco.editor.create(document.getElementById(id), {
        value: codeStr,
        theme: "vs-dark",
        language: mode[type],
        automaticLayout: true
      });
      // ctrl + s 刷新
      this.editorObj[type].onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode();
        }
      });
    },
    newVueFun(css, main, html) {
      const $previewApp = document.getElementById("previewApp" + this.id);
      $previewApp.innerHTML = `<style>${css}</style><div id="jsFmhow${this.id}"></div>`;
      main = eval(`(${main})`);
      main.template = `<div>${html}</div>`;
      new window.OUTVUE({
        router,
        components: {
          child: main
        },
        data() {
          return {
            visible: true
          };
        },
        template: `<div><child/></div>`
      }).$mount(`#jsFmhow${this.id}`);
    },
    onClose() {
      this.isInitcode = false;
      this.isRefreshCode = false;
      this.isIframeLoaded = false;
    },
    runCode() {
      const jsCodeStr = this.editorObj.js.getValue();
      // try {
      //const ast = parse(jsCodeStr, { sourceType: "module" });
      //const astBody = ast.program.body;
      // if (astBody.length > 1) {
      //   this.$confirm(
      //     "js格式不能识别，仅支持修改export default的对象内容",
      //     "提示",
      //     {
      //       type: "warning"
      //     }
      //   );
      //   return;
      // }
      //if (astBody[0].type === "ExportDefaultDeclaration") {
      const postData = {
        type: "refreshFrame",
        data: {
          html: this.editorObj.html.getValue(),
          js: jsCodeStr.replace(exportDefault, ""),
          css: this.editorObj.css.getValue(),
          scripts: this.scripts,
          links: this.links,
          formData: this.data.formData || {},
          formValue: this.data.formValue || {}
        }
      };
      if (this.type == "pc") {
        this.newVueFun(postData.data.css, postData.data.js, postData.data.html);
      }
      else {
        this.$refs.previewPage.contentWindow.postMessage(postData, "*");
      }
      // }
      //   else {
      //     this.$message.error("请使用export default");
      //   }
      // } catch (err) {
      //   this.$message.error(`js错误：${err}`);
      //   console.error(err);
      // }
    },
    //生成代码
    generateCode() {
      const html = vueTemplate(this.editorObj.html.getValue());
      const script = vueScript(this.editorObj.js.getValue());
      const css = cssStyle(this.editorObj.css.getValue());
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    //导出代码
    exportFile() {
      this.$prompt("文件名:", "导出文件", {
        inputValue: `${+new Date()}.vue`,
        closeOnClickModal: false,
        inputPlaceholder: "请输入文件名"
      }).then(({
        value
      }) => {
        if (!value) value = `${+new Date()}.vue`;
        const codeStr = this.generateCode();
        const blob = new Blob([codeStr], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, value);
      });
    }
  }
};

</script>
<style
  lang="scss"
  scoped
>
$editorTabsborderColor: #121315;

.code-edit-box__left {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}

.code-edit-box__left__tabs ::v-deep {
  background: $editorTabsborderColor;

  .el-tabs__header {
    margin: 0;
    border-bottom-color: $editorTabsborderColor;

    .el-tabs__nav {
      border-color: $editorTabsborderColor;
    }
  }
  
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
    color: #888a8e;
    border-left: 1px solid $editorTabsborderColor !important;
    background: #363636;
    margin-right: 5px;
    user-select: none;
  }
  
  .el-tabs__item.is-active {
    background: #1e1e1e;
    border-bottom-color: #1e1e1e !important;
    color: #fff;
  }
  
  .el-icon-edit {
    color: #f1fa8c;
  }
  
  .el-icon-document {
    color: #a95812;
  }
}

.code-edit-box__left__tabs__editor {
  position: absolute;
  top: 33px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}

.code-edit-box__right__btn {
  height: 33px;
  background: #f2fafb;
  padding: 0 15px;
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;

  .bar-btn {
    display: inline-block;
    padding: 0 6px;
    line-height: 32px;
    color: #8285f5;
    cursor: pointer;
    font-size: 14px;
    user-select: none;

    & i {
      font-size: 20px;
    }
    
    &:hover {
      color: #4348d4;
    }
  }
  
  .bar-btn+.bar-btn {
    margin-left: 8px;
  }
  
  .delete-btn {
    color: #f56c6c;

    &:hover {
      color: #ea0b30;
    }
  }
}

.code-edit-box__right {
  height: 100%;
  position: relative;

  .h5-viwer-box {
    margin: 20px auto;
    width: 45vh;
    height: 80vh;
    box-sizing: content-box;
    border: solid 10px #000000;
    border-radius: 10px;
    box-shadow: #dddddd 10px 10px 20px;
  }
  
  .h5-viwer {
    width: 45vh;
    height: 80vh;
    border: 0;
    padding: 0;
  }
}

.code-edit-box__right__scrollbox {
  position: absolute;
  top: 34px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
}

.code-edit-box {
  height: 500px;
  border: 1px solid #ddd;

  &.mobile {
    min-height: 90vh;
  }
  
  ::v-deep .el-drawer__header {
    display: none;
  }
}

</style>
