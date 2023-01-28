//js
import validatorUtils from '@/assets/js/validator';

export default {
  props: {
     //显示的文本
     label: {
      type: String,
      required: false
    },
    //是否允许为空
    allowNull: {
      type: Boolean,
      default: true
    },
    //提示文本
    placeholder: {
      type: String,
      default: ''
    },
    //是否允许更新
    allowUpdate: {
      type: Boolean,
      default: true
    },
    //值
    value: {
      type: [String, Number],
      default: ''
    },
    // 默认的label宽度
    labelStyle: {
      type: Object,
      default: () => {
        return {
          width: '126px',
        }
      }
    },
    //不可编辑默认且无值时显示
    readonlyValue: {
      type: String,
      default: '暂无'
    },
    //不可编辑下默认显示的值
    valueStyle: {
      type: Object,
      default: () => {
        return {
          width: '230px',
        }
      }
    },
    //错误提示
    formErrorMsg: {
      type: [String, Boolean],
      default: ''
    },
    //校验方法
    validate: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  computed: {

  },
  methods: {
    /**
     * 去除冒号
     * @param data
     * @returns {*}
     */
    removeColon(data) {
      if (!data) {
        return;
      }
      const reg = /(：|:)$/gi;
      return data.replace(reg, '');
    },
    /**
     * 失去焦点
     */
    onBlur() {
      this.$emit('blur', this.value);
      this.$emit('input', this.value);
      if (!this.$isEmptyObj(this.validate)) {
        validatorUtils.validateData({ key: this.value }, { key: this.validate }).then(err => {
          this.$emit('update:formErrorMsg', err ? err[0].message : '');
        });
      }
    },
    /**
     * 获取焦点
     */
    onFocus() {
      this.$emit('focus', this);
    },
    /**
     * 错误提示
     * @param data
     * @param words
     * @returns {*}
     */
      formatError(data, words = '填写') {
        if (!data) {
          return this.removeColon(`请${words}${this.label}`);
        } else {
          return this.removeColon(`${data}${this.label}`);
        }
      },
  }

}
