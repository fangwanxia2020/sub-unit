<template>
  <div class="ty-captcha">
    <slot name="phone"></slot>
    <div class="ty-captcha__row">
      <el-input
        :value="value.yzm"
        onkeyup="value=value.replace(/[^\d]/g,'')"
        @input="changeValFun"
        :placeholder="placeholder"
        class="ty-captcha__input"
        :style="{width:width}"
        :disabled="!isPhone"
      ></el-input>
      <el-button
        class="ty-captcha__button"
        type="primary"
        @click="_send"
        v-if="showtime===null"
        :disabled="!isPhone"
      >获取验证码</el-button>
      <div
        v-else
        class="ty-captcha__text"
      >{{showtime}}</div>
    </div>
  </div>
</template>
<script>
/**
  * 组件名称 TyCaptcha
  * @module components/business/TyCaptcha
  * @desc 获取验证码组件
  * @author lyt
  * @date 2020年06月19日 15:00
  * @param {String} [width]    - 宽度
  * @param {Number} [countTime] - 倒计时时间
  * @param {String} [placeholder] - 文本框占位文本
  * @param {String} [phone] - 获取验证码的电话
  * @param {Object,String} [value] - 验证码的值
  * @param {String} [action] - 接口地址
  * @example 调用示例
  *   <ty-captcha :phone="phone" :countTime="60" v-model="yzmVal">
        <div slot="phone">
          <el-input v-model="phone" placeholder="请输入电话"></el-input>
        </div>
      </ty-captcha>
**/
import {
  sendMsg
}
from "./api";
export default {
  name: "TyCaptcha",
  props: {
    width: {
      //宽度
      type: String,
      default: "130px"
    },
    countTime: {
      //倒计时时间
      type: Number,
      default: 3
    },
    placeholder: {
      //文本框占位文本
      type: String,
      default: "输入验证码"
    },
    phone: {
      //获取验证码的电话
      type: String,
      default: ""
    },
    value: {
      //验证码的值
      type: [Object, String],
      default: () => {}
    },
    action: {
      //接口地址
      type: String,
      default: ""
    },
    //请求参数
    actionParams: {
      type: Object
    },
  },
  data() {
    return {
      //后端返回的信息
      backVal: "",
      //计时器
      timeCounter: null,
      //null 则显示按钮 秒数则显示读秒
      showtime: null
    };
  },
  computed: {
    //验证是否为手机类型数据
    isPhone() {
      return this.isPhoneFun(this.phone);
    }
  },
  methods: {
    //发送验证码
    _send() {
      //调用获取验证码接口
      const phone = this.phone;
      let param = {
        phone
      };
      if (this.actionParams) {
        param = {
          ...param,
          ...this.actionParams
        };
      }
      sendMsg(this.action, param).then(res => {
        this.backVal = res.data;
      });
      this.countDown(this.countTime);
    },
    //检验是否为电话方法
    isPhoneFun(phone) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(phone)) {
        return false;
      }
      else {
        return true;
      }
    },
    //倒计时显示处理
    countDownText(s) {
      this.showtime = `${s}s后重新获取`;
    },
    // 倒计时
    countDown(times) {
      const self = this;
      // 时间间隔 1秒
      const interval = 1000;
      let count = 0;
      self.timeCounter = setTimeout(countDownStart, 0);
      
      function countDownStart() {
        if (self.timeCounter == null) {
          return false;
        }
        count++;
        self.countDownText(times - count + 1);
        if (count > times) {
          clearTimeout(self.timeCounter);
          self.showtime = null;
        }
        else {
          self.timeCounter = setTimeout(countDownStart, interval);
        }
      }
    },
    //改变组件的返回值
    changeValFun(val) {
      this.triggerChange({
        yzm: val,
        backVal: this.backVal
      });
    },
    //触发父级组件值
    triggerChange(changedValue) {
      this.$emit("input", changedValue);
    }
  }
};

</script>
<style
  lang="less"
  scoped
>
.ty-captcha__row {
  display: flex;
}

.ty-captcha__input {
  margin-right: 10px;
}

.ty-captcha__text {
  line-height: 40px;
  font-size: 14px;
  color: #999;
}

</style>
