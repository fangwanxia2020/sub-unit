<template>
  <div>
    <el-drawer
      v-bind="$attrs"
      v-on="$listeners"
      @opened="onOpen"
      @close="onClose"
    >
      <div class="view-box">
        <div class="view-box-btn">
          <i
            :class="{sel:comType=='pc'}"
            class="el-icon-monitor"
            @click="changeType('pc')"
          ></i>
          <i
            class="el-icon-mobile"
            :class="{sel:comType=='mobile'}"
            @click="changeType('mobile')"
          ></i>
          <i
            class="el-icon-close"
            @click="$emit('update:visible', false)"
          ></i>
        </div>
        <ty-code-edit
          :key="codeEditkey"
          :data="codeData"
          :type="comType"
          ref="mychild"
          height="100%"
          v-if="Codevisible"
          mobileUrl="http://cbos1.tianyuaninternet.com/mobileDemo/#/pages/TyForm/index"
        />
      </div>
      <!--  http://localhost:8082/#/pages/TyForm/index http://localhost:8083/#/pages/TyForm/index   http://cbos1.tianyuaninternet.com/mobileDemo/#/pages/TyForm/index -->
    </el-drawer>
  </div>
</template>
<script>
import TyCodeEdit from "components/TyCodeEdit";
import generateCodePC from "./generateCode.js";
import generateCodeMB from "./generateCodeMB.js";
export default {
  props: ["formData", "type"],
  components: {
    TyCodeEdit
  },
  watch: {
    comType(val) {
      this.generateCode = val == "pc" ? generateCodePC : generateCodeMB;
    }
  },
  data() {
    return {
      Codevisible: false,
      generateCode: generateCodePC,
      comType: this.type,
      codeEditkey: new Date().getTime().toString()
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {
    codeData() {
      return this.getCodeData(this.formData);
    }
  },
  methods: {
    getCodeData(o) {
      console.log(o, "发生改变-");
      return {
        html: this.generateCode(JSON.stringify(o), "template"),
        script: this.generateCode(JSON.stringify(o), "script"),
        css: this.generateCode(JSON.stringify(o), "css"),
        formData: this.formData,
        formValue: {}
      };
    },
    onOpen() {
      this.Codevisible = true;
      //this.$refs.mychild.onOpen(this.codeData);
    },
    onClose() {
      //this.$refs.mychild.onClose();
      this.Codevisible = false;
    },
    changeType(type) {
      this.comType = type;
      this.codeEditkey = new Date().getTime().toString();
    }
  }
};

</script>
<style
  lang="scss"
  scoped
>
::v-deep .el-drawer__header {
  display: none;
}

.bar-btn {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99999;
  font-size: 20px;
  line-height: 33px;
  padding: 0 10px;
  color: #f00;
  cursor: pointer;
}

.view-box {
  position: relative;
  padding-right: 50px;
  height: 100%;

  .view-box-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;

    i {
      height: 50px;
      width: 50px;
      font-size: 30px;
      border: 1px solid #ddd;
      display: block;
      line-height: 50px;
      text-align: center;
      cursor: pointer;

      &.sel {
        background: #007aff;
        color: #fff;
      }
    }
  }
}

</style>
