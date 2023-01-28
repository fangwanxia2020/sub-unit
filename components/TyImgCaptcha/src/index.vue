<template>
  <div>
    <el-dialog :width="`${catcha.width+20}px`"
               append-to-body
               :visible.sync="showCaptcha"
               :modal-append-to-body="false"
               :show-close="false"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               v-if="mode=='popup'">
      <template slot="title">
        <i class="el-icon-close"
           @click="onClose()"></i>
      </template>
      <Captcha ref="dialogopen"
               :width="catcha.width"
               :hight="catcha.hight"
               :sw="catcha.sw"
               :sh="catcha.sh"
               :blockY="catcha.blockY"
               :imgurl="catcha.imgurl"
               :blockImgurl="catcha.blockImgurl"
               :sliderText="catcha.sliderText"
               @verifySlider="verifySlider"
               @refresh="onRefresh" />
    </el-dialog>
    <Captcha ref="dialogopen"
             v-else
             :width="catcha.width"
             :hight="catcha.hight"
             :sw="catcha.sw"
             :sh="catcha.sh"
             :blockY="catcha.blockY"
             :imgurl="catcha.imgurl"
             :blockImgurl="catcha.blockImgurl"
             :sliderText="catcha.sliderText"
             @verifySlider="verifySlider"
             @refresh="onRefresh" />
  </div>

</template> 
   
<script>
import Captcha from "./captcha";
export default {
  name: 'TyImgCaptcha',
  components: { Captcha },
  props: {
    //展现形式 popup/inline
    mode: {
      type: String,
      default: "popup",
    },
    //弹窗显隐
    showCaptcha: {
      type: Boolean,
      default: false,
    },
    catchaObj: {
      type: Object,
      default: {},
    },
  },
  watch: {
    catchaObj: {
      handler: function (val) {
        if (val) {
          this.catcha = {
            ...this.catcha,
            ...val,
          };
          this.$nextTick(() => {
            if (this.$refs.dialogopen) {
              this.$refs.dialogopen.reset(this.catcha.blockY);
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      catcha: {
        blockY: 0, //滑块的y坐标
        imgurl: "", //大图
        blockImgurl: "", //小图
        sliderText: "向右滑动完成拼图", //文案
        width: 320, //大图高度
        hight: 160, //大图宽度
        sh: 60, //小图高度
        sw: 60, //小图宽度
      }, // 图片验证码传值
    };
  },
  created() {},
  methods: {
    //验证
    verifySlider(obj) {
      this.$emit("verifySlider", obj.left, (isTrue) => {
        if (isTrue) {
          this.$refs.dialogopen.handleSuccess();
          this.clearInfo(isTrue);
        } else {
          this.$refs.dialogopen.handleFail();
          this.clearInfo(isTrue);
        }
      });
    },
    // 刷新
    onRefresh() {
      this.$emit("refresh");
    },
    //关闭弹窗
    onClose() {
      this.$emit("closeDialog");
    },
    //验证后清楚位置信息
    clearInfo(isTrue) {
      setTimeout(() => {
        this.$refs.dialogopen.clear();
        // if (isTrue) {
        //   //弹窗模式需要
        //   if (this.mode == "popup") {
        //       this.onClose()
        //   }
        // } else {
        //   this.onRefresh();
        // }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 8px !important;
}
::v-deep .el-dialog__header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
