/**
 * 校验
 */
 import asyncValidator from 'async-validator';

 const idCode = /(^[1-9]\d{5}(19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/; //身份证校验
 const creditCode = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/; //信用代码校验
 const url = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/; // 网址url校验
 //校验是否允许为空
 let validateNull = (rule, value, callback) => {
   if (rule.required && (!value || value.length === 0)) {
     callback(rule.tip ? rule.tip : '请输入');
   } else {
     callback();
   }
 };
  //校验是否选择
  let validateNoSelect = (rule, value, callback) => {
    if (rule.required && !value && value !== 0) {
      callback(rule.tip ? rule.tip : '请选择');
    } else {
      callback();
    }
  };
  let validateNoNumber= (rule, value, callback) => {
    console.log('[ rule, value ] >', rule, !value || value == 0)
    if (rule.required && !value && value == 0) {
      callback(rule.tip ? rule.tip : '请输入');
    } else if(rule.required && !(/^\d+$/.test(value))){
      callback('请填写正确的');
    } else {
      callback();
    }
  };
 //联系电话校验（固话+手机） /^[0-9-\(\)]{7,50}$/
 let validateContact = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^[0-9-]{7,50}$/.test(value))) {
     //固定电话号码 区号：3-4位，手机号11位，固定电话7-8位
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //手机号码（手机）
 let validatePhone = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^[1]([3-9])\d{9}$/.test(value))) {
     //电话号码 区号：3-4位，手机号11位，固定电话7-8位
     callback('请填写正确的');
   } else {
     callback();
   }
 };

 //邮箱校验
 let validateEmail = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //传真校验faxNum: /^(\d{3,4}-)?\d{7,8}$/,
 let validateFax = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^([0-9]{2,3}-)?([0-9]{3,4}-)?([0-9]{7,8})$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //传真校验faxNum: /^(\d{3,4}-)?\d{7,8}$/,
 let validateFaxPc = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^(\d{3,4}-)?\d{7,8}$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //校验年龄
 let validateAge = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请输入');
   } else if (value && !(/^[1-9]\d?$|^1[0-2]\d$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 let validateCard = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && (value.length < 8)) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //身份证校验
 let validateIdCard = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(idCode.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //港澳居民来往内地通行证
 let validateHMID = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^[HM]{1}([0-9]{10}|[0-9]{8})$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //台湾居民来往大陆通行证
 let validateTWID = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^([A-Z]\d{7}|\d{8})$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //护照
 let validatePassport = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^(E\d{8}|(SE|DE|PE)\d{7}|MA\d{7}|(K|KJ)\d{8})$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //驾驶证 最大长度20中文字符
 let validateDrivers = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(value.length <= 20)) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //军官证 最大长度20中文字符
 let validateOfficers = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(value.length <= 20)) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //士兵证 最大长度20中文字符
 let validateSoldier = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(value.length <= 20)) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //其他证件 最大长度20中文字符
 let validateOtherCertificates = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(value.length <= 20)) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //统一社会信用代码校验（18位的阿拉伯数字或大写英文字母）
 let validateCreditCode = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   // } else if (value && !(/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/.test(value))) {
   } else if (value && !(/^[0-9A-Z]{18}$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //验证邮编
 let validatePostcode = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^\d{6}$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };

 //校验金额，大于0，整数位数最多为11位，最多保留2位小数点
 const validateMoney = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(/^(?!0+(?:\.0+)?$)(?:[1-9]\d{0,10}|0)(?:\.\d{1,2})?$/.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 //默认校验数量大于0;max最多为max位;hasZero=true包含0;
 const validateAmount = (rule, value, callback) => {
   let reg = /^[1-9]\d*$/;
   if (rule.max) {
     reg = new RegExp("^[1-9]{1}[0-9]{0," + (+rule.max - 1) + "}$");
     if (rule.hasZero) {
       reg = new RegExp("^(?!0)\\d{1," + +rule.max + "}$|^0$");
     }
   }
   if (rule.required && !value) {
     callback('请填写');
   } else if (value && !(reg.test(value))) {
     callback('请填写正确的');
   } else {
     callback();
   }
 };
 /**
  * 校验最大数字
  * max 最大数值;
  * hasZero=true包含0;
  * @param rule
  * @param value
  * @param callback
  */
 const validateMaxNumber = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请填写');
   } else if (rule.max) {
     if (value && ((+value>0 && +value <= +rule.max) || (rule.hasZero && +value===0))) {
       callback();
     } else {
       callback('请填写不大于'+rule.max+'的数字');
     }
   } else {
     callback();
   }
 };

 /**
  * 校验最大数字
  * max 最大数值;
  * hasZero=true包含0;
  * @param rule
  * @param value
  * @param callback
  */
 const validateMaxMessage = (rule, value, callback) => {
   if (rule.required && !value) {
     callback('请输入');
   } else if (rule.max) {
     if (value && value.length <= rule.max) {
       callback();
     } else {
       callback('请输入'+rule.max+'个字以内的信息');
     }
   } else {
     callback();
   }
 };

  /**
  * 校验最大数字
  * max 最大数值;
  * hasZero=true包含0;
  * @param rule
  * @param value
  * @param callback
  */
   const validateLicense  = (rule, value, callback) => {
    if (rule.required && !value) {
      callback('请输入');
    } else if (value && /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[A-Z0-9]{5}$/.test(value)) {
      callback();
    } else {
      callback('请填写正确的');
    }
  };

 const utils = {
   validateNull: validateNull,
   validateNoSelect: validateNoSelect,
   validateNoNumber: validateNoNumber,
   validateContact: validateContact,
   validatePhone: validatePhone,
   validateEmail: validateEmail,
   validateFax: validateFax,
   validateFaxPc: validateFaxPc,
   validateAge: validateAge,
   validateCard: validateCard,
   validateIdCard: validateIdCard,
   validateHMID: validateHMID,
   validateTWID: validateTWID,
   validateCreditCode: validateCreditCode,
   validatePassport: validatePassport,
   validateDrivers: validateDrivers,
   validateOfficers: validateOfficers,
   validateSoldier: validateSoldier,
   validateOtherCertificates: validateOtherCertificates,
   validatePostcode: validatePostcode,
   idCode: idCode,
   creditCode: creditCode,
   url: url,
   validateMaxNumber: validateMaxNumber,
   validateMoney: validateMoney,
   validateAmount: validateAmount,
   validateMaxMessage: validateMaxMessage,
   validateLicense:validateLicense,
   /**
    * 验证规则
    * @param data  表单数据
    * @param rules  规则
    * @returns {Promise<any>}
    */
   validateData(data, rules) {
     return new Promise((resolve, reject) => {
       let validator = new asyncValidator(rules);
       validator.validate(data, {firstFields: true}, (errors, fields) => {
         resolve(errors)
       });
     });
   },
   /**
    * 清除错误提示
    */
   clearErrorMsg(errorMsg) {
     for (let key in errorMsg) {
       errorMsg[key] = '';
     }
   }
 };

 export default utils
