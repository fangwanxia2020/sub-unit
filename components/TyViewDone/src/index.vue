<template>
  <div
    class="ty-view-done"
    :id="`${id}-wrap`"
  >
    <template v-if="isIframeMode">
      <div class="ty-view-done__btn">
        <el-button
          type="primary"
          @click="showFun"
        >{{showControl?'隐藏':'查看'}}</el-button>
        <el-button
          type="primary"
          @click="print(1)"
          v-if="isExportWord"
        >导出word</el-button>
        <el-button
          type="primary"
          @click="print(2)"
          v-if="isExportPdf"
        >导出pdf</el-button>
        <el-button
          type="primary"
          @click="print(0)"
          v-if="isPrint"
        >打印</el-button>
      </div>
      <div
        class="ty-view-done__show"
        v-show="showControl"
        id="jsTyViewDoneShow"
      >
        <iframe
          :src="`${iframeUrl.indexOf('#')>=0?iframeBaseUrl+iframeUrl:iframeUrl+iframeBaseUrl}`"
          :id="id"
          :style="{width:iframeWidth,height:iframeHeight}"
          frameborder="0"
          scrolling="auto"
        ></iframe>
      </div>
    </template>
    <template v-else>
      <div class="btn-wrap">
        <el-button
          type="primary"
          @click="exportPdf"
          v-if="isExportPdf"
        >导出pdf</el-button>
      </div>
      <div :class="{pdfhide:!pdfShow}">
        <div
          :id="id"
          class="jsPdfShow"
        >
          <div class="page-box">
            <slot>导出pdf的内容</slot>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
/**
 * 组件名称 TyViewDone
 * @module components/others/TyViewDone
 * @desc 页面视图处理组件，包含打印，查看，word下载，pdf下载
 * @author lyt
 * @date 2020年06月09日 15:00
 * @param {Boolean} [show]    - 显示隐藏
 * @param {String} [iframeUrl]    - iframe文件地址
 * @param {String} [fileName] - 下载文件名称
 * @param {Boolean} [isShow]    - 是否可以控制显示隐藏
 * @param {Boolean} [isExportWord] - 是否可以导出word
 * @param {Boolean} [isExportPdf]    - 是否可以导出pdf
 * @param {Boolean} [isPrint] - 是否可以打印
 * @example 调用示例
 *  <ty-upload-file v-model="fileVal" :showUrl="true"></ty-upload-file>
 **/
import {
  loadScriptQueue
}
from "utils/loadScript";
export default {
  name: "TyViewDone",
  props: {
    id: {
      type: String,
      default: function() {
        return ("ty-view-done-iframe-" + +new Date().getTime() + Math.floor(Math.random() * 10) + "");
      }
    },
    //iframe高度
    iframeHeight: {
      type: String,
      default: "750px"
    },
    //iframe宽度
    iframeWidth: {
      type: String,
      default: "100%"
    },
    //显示隐藏
    show: {
      type: Boolean,
      default: true
    },
    //是否是iframe模式
    isIframeMode: {
      type: Boolean,
      default: true
    },
    pdfShow: {
      type: Boolean,
      default: true
    },
    //文件地址
    iframeUrl: {
      type: String,
      default: ""
    },
    //下载文件名称
    fileName: {
      type: String,
      default: "文件名称"
    },
    //是否可以控制显示隐藏
    isShow: {
      type: Boolean,
      default: true
    },
    //是否可以导出word
    isExportWord: {
      type: Boolean,
      default: true
    },
    //是否可以导出pdf
    isExportPdf: {
      type: Boolean,
      default: true
    },
    //是否可以打印
    isPrint: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  data() {
    return {
      //解决ie打不开的问题 window.location.href.split('#')[0]
      iframeBaseUrl: `?t=${new Date().getTime()}`,
      showControl: this.show,
      publicPath: process.env.BASE_URL
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const base = this.publicPath + "js";
      let arrload = [`https://unpkg.com/jquery@1.11.0/dist/jquery.min.js`,
        `https://unpkg.com/filesaver.js@1.3.4/FileSaver.min.js`,
        `https://cdn.jsdelivr.net/gh/liuyting/weiyu@0.0.3/wordexport.js`,
        `https://unpkg.com/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js`,
        `https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js`
      ];
      if (!this.isIframeMode) {
        arrload = [`https://unpkg.com/jquery@1.11.0/dist/jquery.min.js`,
          //`https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js`,
          //`https://cdn.bootcdn.net/ajax/libs/html2canvas/0.4.0/html2canvas.min.js`,
          `https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.js`,
          `https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js`
          // `https://cdn.bootcss.com/jspdf/1.3.4/jspdf.debug.js`
        ]
      }
      loadScriptQueue(arrload,
        () => {
          console.log("加载脚本完成");
        });
    },
    showFun() {
      this.showControl = !this.showControl;
    },
    async print(num) {
      switch (num) {
        //打印
        case 0:
          let iframe = document.getElementById(this.id);
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          break;
          //导出word
        case 1:
          let styleText = $(document.getElementById(this.id).contentWindow.document).find("style").html();
          styleText = $(document.getElementById(this.id).contentWindow.document).find("#app").wordExport(
            this.fileName, styleText);
          break;
          //导出pdf
        case 2:
          //解决pdf下载内容不全的问题
          let iwin = document.getElementById(this.id).contentWindow;
          iwin.scroll(0, 0);
          let target = $(document.getElementById(this.id).contentWindow.document.body);
          target.css({
            "minHeight": "2000px",
            "paddingRight": "20px"
          });
          target.find("img").each(function(index) {
            $(this).attr("crossOrigin", "anonymous");
          });
          let printHtml = target.get(0); // 页面某一个div里面的内容，通过id获取div内容
          console.log(printHtml, "---ooo", document.querySelector(`#${this.id}`));
          // const XX = printHtml.offsetWidth / 1000;
          // const HH = printHtml.offsetHeight / XX;
          // console.log(printHtml.offsetWidth, printHtml.offsetHeight, "-----");
          const canvas = await html2canvas(printHtml, {
            allowTaint: true,
            useCORS: true,
            scale: 2,
            // width: 1000,
            // height: 1000 * printHtml.offsetHeight / printHtml.offsetWidth, //给canvas设置高度，
          })
          // let oImg = new Image();
          // oImg.src = canvas.toDataURL(); // 导出图片
          // target.get(0).appendChild(oImg); // 将生成的图片添加到body
          // const canvas = new html2canvas(document.querySelector(`#${this.id}`), {
          //   allowTaint: true,
          //   scale: 2
          // }).then(canvas => {
          //   // canvas为转换后的Canvas对象
          //   // let oImg = new Image();
          //   // oImg.src = canvas.toDataURL();  // 导出图片
          //   // document.body.appendChild(oImg);  // 将生成的图片添加到body
          // });
          let contentWidth = canvas.width;
          let contentHeight = canvas.height;
          console.log(contentWidth, "----contentWidth");
          let position = 0;
          let pdfWidth = (contentWidth + 10) / 2 * 0.75;
          let pdfHeight = (contentHeight + 200) / 2 * 0.75; // 500为底部留白
          let imgWidth = pdfWidth;
          let imgHeight = (contentHeight / 2 * 0.75);
          let pageData = canvas.toDataURL('image/jpeg', 1.0);
          let PDF = new jsPDF('', 'pt', [pdfWidth, pdfHeight]);
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          const name = this.fileName;
          //let PDF = new jsPDF("p", "mm", "a4");
          // let doc = new jsPDF('', 'pt', 'a4')
          //这里设置的是a4纸张尺寸
          // PDF.addImage(pageData, 'JPEG', 0, 0, 210, 297);
          PDF.save(name + '.pdf');
          target.css({
            "minHeight": "500px",
            "paddingRight": "0"
          });
          // let target = $(document.getElementById(this.id).contentWindow.document.body);
          // $(target).css("font-size", "20px");
          // let pdf = new jsPDF("p", "pt", "a4");
          // pdf.internal.scaleFactor = 2;
          // let options = {
          //   width: 1000,
          //   pagesplit: true, //设置是否自动分页
          //   background: "#FFFFFF" //如果导出的pdf为黑色背景，需要将导出的html模块内容背景 设置成白色。
          // };
          // let printHtml = target.get(0); // 页面某一个div里面的内容，通过id获取div内容
          // //解决pdf下载内容不全的问题
          // let iwin = document.getElementById(this.id).contentWindow;
          // iwin.scroll(0, 0);
          // const name = this.fileName;
          // pdf.addHTML(printHtml, 15, 15, options, function() {
          //   pdf.save(name);
          // });
          // $(target).css("font-size", "16px");
          break;
      }
    },
    //将base64转换为文件对象
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      //转换成file对象
      return new File([u8arr], filename, {
        type: mime
      });
      //转换成成blob对象
      //return new Blob([u8arr],{type:mime});
    },
    //设置图片属性，解决ios导出不了的问题
    setImgFun(target) {
      return new Promise(resolve => {
        $(target).find("img").each(function(index) {
          var src = $(this).attr("src");
          $(this).attr("crossOrigin", "anonymous");
          $(this).error(function() {
            $(this).remove();
          });
          $(this).load(function() { //ios图片需要都要赋值宽高才能导出
            $(this).css("width", $(this).width());
            $(this).css("height", $(this).height());
          }).attr("src", `${src}&s=${Math.random().toString()}`);
        });
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
    async exportPdf(isReturn) {
      var target = document.getElementById(this.id);
      //为了解决ios导出不了图片的问题
      await this.setImgFun(target);
      target.style.background = "#FFFFFF";
      document.getElementsByTagName("body")[0].style.minHeight = target.clientHeight + 300 + 'px';
      document.getElementsByTagName("body")[0].style.minWidth = target.clientWidth + 300 + 'px';
      const selt = this;
      document.getElementById(`${this.id}-wrap`).scrollTo(0, 0);
      window.scrollTo(0, 0);
      const canvas = await html2canvas(target, {
        useCORS: true,
        scale: 2
      });
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;
      //一页pdf显示html页面生成的canvas高度;
      var pageHeight = contentWidth / 592.28 * 841.89;
      //未生成pdf的html页面高度
      var leftHeight = contentHeight;
      //页面偏移
      var position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 595.28;
      var imgHeight = 592.28 / contentWidth * contentHeight;
      var pageData = canvas.toDataURL('image/jpeg', 1.0);
      var pdf = new jsPDF('', 'pt', 'a4');
      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }
      else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      const name = selt.fileName;
      document.getElementsByTagName("body")[0].style.minHeight = '0px';
      document.getElementsByTagName("body")[0].style.minWidth = '0px';
      if (isReturn) {
        if (isReturn == 'blob') {
          var blobF = pdf.output('blob');
          return blobF;
        }
        else {
          // 将pdf输入为base格式的字符串
          var buffer = pdf.output("datauristring");
          // 将base64格式的字符串转换为file文件
          var myfile = selt.dataURLtoFile(buffer, name + '.pdf');
          return myfile;
        }
      }
      else {
        //var url = canvas.toDataURL("image/png", 1.0);
        // $('body').append('<img src="' + url + '" height="100px;"/>')
        pdf.save(name + '.pdf');
      }
    }
  },
  watch: {}
};

</script>
<style
  lang="less"
  scoped
>
.ty-view-done {
  display: block;

  iframe {
    background: #fff;
  }
}

.pdfhide {
  height: 0;
  overflow: auto;
}

.jsPdfShow {
  width: 1000px;
}

</style>
