<template>
  <div
    class="ty-export"
    @click="exportExecl"
  >
    <slot>
      <el-button
        type="primary"
        :disabled="disabled"
        :size="size"
      >{{buttonText}}</el-button>
    </slot>
  </div>
</template>
<script>
/**
 * 组件名称 TyExport
 * @module components/form/TyExport
 * @desc 导出文件
 * @author lyt
 * @date 2020年10月27日 15:00
 * @param {Object} [actionParams]    - 请求参数
 * @param {String} [action]    - 导出文件地址
 * @param {Number} [timeout] - 超时时间
 * @param {Boolean} [disabled]    - 是否可以导出
 * @param {[String]} [exportName] - 导出文件名
 * @param {[String]} [exportType]    -导出文件类型
 * @param {String} [buttonText] - 导出按钮文本
 * @example 调用示例
 *  <ty-upload-file v-model="fileVal" :showUrl="true"></ty-upload-file>
 **/
import {
  exportFile
}
from "./api";
export default {
  name: "TyExport",
  props: {
    actionParams: {
      //请求参数
      type: Object,
      default: () => {}
    },
    //大小
    size: {
      type: String,
      default: "medium"
    },
    action: {
      //导出文件地址
      type: String,
      default: ""
    },
    method: {
      // 请求方法
      type: String,
      default: 'post'
    },
    timeout: {
      //超时时间
      type: Number,
      default: 300000
    },
    disabled: {
      //是否可以导出
      type: Boolean,
      default: false
    },
    exportName: {
      //导出文件名
      default: ""
    },
    exportType: {
      //导出文件类型
      default: "xlsx"
    },
    buttonText: {
      //导出按钮文本
      type: String,
      default: "导出文件"
    },
    //导出前触发方法
    beforeExport: {
      type: Function
    },
    //是否可动态修改url
    dynamicConfig:{
        type:Boolean,
        default:false
    }
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {
    //调用请求导出接口
    exportExecl() {
      if (this.beforeExport) {
        const fun = this.beforeExport();
        if (fun) {
          if (fun != true) {
            //判断是否promise方法
            fun.then(result => {
              this.exportFun();
            });
          }
          else {
            this.exportFun();
          }
        }
      }
      else {
        this.exportFun();
      }
    },
    exportFun() {
      if (this.disabled) {
        return;
      }
      if (!this.action) {
        this.$message.error("请求地址不能为空！");
        return;
      }
      exportFile(this.action, this.actionParams, this.timeout, this.method,this.dynamicConfig).then(res => {
        // 获取接口里headers的文件名
        let fileName
        if(res.headers && res.headers['content-disposition']) {
          fileName = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
        }
        // const fileName = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
        let defineName
        if(this.exportName) {
          defineName = `${this.exportName}.${this.exportType}`
        }
        let downloadname = this.exportName ? defineName : fileName ? decodeURI(fileName) : '文件名'
        this.saveAs(res.data, `${downloadname}`);
      });
    },
    //保存文件
    saveAs(data, filename) {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        //IE浏览器保存
        var type = "text/plain; charset=UTF-8";
        // var type = "'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8',"
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
    }
  }
};

</script>
<style
  lang="scss"
  scoped
>
.ty-export {
  display: inline-block;
}

</style>
