import { Base64 } from 'js-base64'
import area from './json/area';
import Vue from 'vue'
export function isArray(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
}

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) == '[object Object]';
}

/**
 * 判断是否是空对象
 * @param {Object} object 响应数据
 * @returns {Boolean}
 */
 export function isEmptyObject(object) {
  return JSON.stringify(object) === '{}'
}

//字符替换*
/*
text:替换的字符
start:开始替换*的位置
len:替换几个*
*/
export function replaceStr(text, start, len) {
    if (!text) return "";
    const startStr = start < 1 ? 1 : start;
    const stopStr = start + len - 1;
    const replacetext = '*'.repeat(len);
    const mystr = text.substring(0, startStr - 1) + replacetext + text.substring(stopStr);
    return mystr;
}


/**
 * 检查名称--正则校验
 * @param name
 * @returns {boolean}
 */
export function checkName(name) {
    let reg = /^[u4e00-u9fa5·0-9A-z ]+$/; //验证规则
    return reg.test(name);
}


/**
 * 检查密码--正则校验
 * 校验规则为:含有特殊符号、数字和字母的8-16位字符串
 * @param value
 */
export function checkPassword(value) {
    let regExp = /(?=.*[0-9０-９])(?=.*[a-zA-Zａ-ｚＡ-Ｚ])(?=.*[~!@#$%^&*()_+\[\];:'{},./"<>?￣！＠#＄％＾＆＊（）＿＋［］；＇，．／{}：＜＞？~！@#￥%……&*（）——+【】；‘’，。、{}：“”《》？])^[\d０-９ａ-ｚＡ-Ｚa-z\A-Z~!@#$%^&*()_+\[\];:'{},./"<>?￣！＠#＄％＾＆＊（）＿＋［］；＇，．／{}：＜＞？~！@#￥%…&*（）——+【】；‘’，。、{}：“”《》？]{8,16}$/;
    return regExp.test(value)
}

/**
 * 检查电子邮箱--正则校验
 * @param email
 * @returns {boolean}
 */
export function checkEmail(email) {
    let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/; //验证规则
    return reg.test(email.toString());
}

export function checkIdCard(sId) {
    if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
        return false
    }
    //身份证城市
    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    if (!aCity[parseInt(sId.substr(0, 2))]) {
        return false
    }
    // 出生日期验证
    var sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(/-/g, "/"),
        d = new Date(sBirthday)
    if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
        return false
    }
    // 身份证号码校验
    var sum = 0,
        weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        codes = "10X98765432"
    for (var i = 0; i < sId.length - 1; i++) {
        sum += sId[i] * weights[i];
    }
    var last = codes[sum % 11]; //计算出来的最后一位身份证号码
    if (sId[sId.length - 1] != last) {
        return false
    }
    return true
}


/**
 * 检查手机号码
 * @param value
 * @returns {boolean}
 */
export function checkPhone(value) {
    //let reg = /1([38][0-9]|4[5-9]|5[0-3,5-9]|6[56]|7[0-8]|9[189]){8}/; //验证规则
    let reg = /^1[3456789]\d{9}$/;
    return reg.test(value.toString());
}


/**
 * 检查是否数字类型
 * @param value
 * @returns {boolean}
 */
export function checkNumber(value) {
    let reg = /^-?([0-9][0-9]*)(\.[0-9]*)?$/; //验证规则
    return reg.test(value.toString());
}


/**
 * 检查是否数字类型并且不超过n位数
 * @param value
 * @param n
 * @returns {boolean}
 */
export function checkNumberAndLength(value, n) {
    if (checkNumber(value) && (value.length <= n)) {
        return true;
    } else {
        return false;
    }
}

//匹配由数字和26个英文字母组成的字符串并且不超过n位数
export function checkNumberAndEnglish(value, n) {
    let reg = /^[A-Za-z0-9]+$/; //验证规则
    if (reg.test(value.toString())) {
        if (n && value.length > n) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}


/**
 * 判断空对象{}
 * @param obj
 * @returns {boolean}
 */
export function isObjectEmpty(obj) {
    for (let o in obj) {
        return false;
    }
    return true;
}

export function previewFile(previewUrl, url, params) {
  params = params || {}
  url = decodeURIComponent(url)  // 防止文件名过长或中文名或特殊字符问题
  const u = navigator.userAgent
  // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  const base64Url = Base64.encode(url)
  const encodeUrl = encodeURIComponent(base64Url)
  const queryMap = {
    url: encodeUrl
  }
  for (const key in params) {
    queryMap[key] = params[key]
  }
  const queryArr = []
  Object.keys(queryMap).forEach((key, index) => {
    let pair = `${key}=${queryMap[key]}`
    if (index === 0) {
      pair = `?${key}=${queryMap[key]}`
    }
    queryArr.push(pair)
  })
  const query = queryArr.join('&')
  const openUrl = previewUrl + query
  if (isiOS) {  // ios 兼容问题修复
    window.location.href = openUrl
    return
  }
  window.open(openUrl)
}

/**
 * 根据ID获取所有父级的某个属性
 * @param {JSON} 	data 	省市区数据源（默认），可以是任何树状数据
 * @param {String} 	id 		省市区ID
 * @param {String} 	key 	要查找的属性，可以是任何属性
 * @param {String} 	idKey 	ID对应的key，默认是addrCodeId
 * @param {String} 	childKey 	子级的key名，默认是children
 *
 * 使用说明：
 * 1.引入   import { getParent } from '@/util/util';
 * 2.使用	getParent(130185,"addrFullname")
 * 			返回 => ["河北省", "河北省石家庄市", "河北省石家庄市鹿泉市"]
 *
 * 			getParent(130185,"addrFullname")
 * 			返回 => ["130000", "130100", "130185"]
 */
 export const getParent = function (data, id, key, idKey, childKey) {
	/* 判断是否有传数据源，如果没有则采用 area 省市区数据 */
	if(!isArray(arguments[0])){ childKey = idKey || 'children'; idKey = key || 'addrCodeId'; key = id; id = data; data = area; };
	let newArray = [];
	for (let i in data) {
		let item = data[i];
		/* 查找一级 */
		if (item[idKey] == id) {
			newArray.push(item[key]);
			break;
		}
		/* 查找子级 */
		if (item[childKey] && item[childKey].length > 0) {
			let arr = getParent(item[childKey], id, key,idKey,childKey);
			if (arr.length != 0) {
				let _arr = [item[key]];
				newArray = _arr.concat(arr);
				break;
			}
		}
	}
	return newArray;
}

//深拷贝 
export const deepClone=(source)=> {
  if (!source && source.typeof !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && source[keys].typeof === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function generateId(length = 8) {
  if(length % 4 !== 0) {
    return getRandom();
  }

  let target = length / 4;


  let res = '';

  for(let i=0;i<target; i++) {
    res += getRandom();
  }

  function getRandom() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }


  return res;
}