import axios from 'axios';
import { Message } from 'element-ui';
import { getToken, removeToken } from '../utils/auth';
import {
  showFullScreenLoading,
  tryHideFullScreenLoading
} from './loading';


const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 10000000
})


export const setBaseUrl = (url) => {
  window.OUTVUE.prototype.baseURL = url;
  service.defaults.baseURL = window.OUTVUE.prototype.baseURL;
};


export const setRouter = (router) => {
  window.OUTVUE.prototype.outRouter = router;
};

export const setTimeout = (val)=> {
  service.defaults.timeout = val;
}


//支持formData其他提交形式
service.defaults.transformRequest = [function (data,headers) {
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    // 把一个参数对象格式化为一个字符串
    return qs.stringify(data)
  } else if (headers['Content-Type'] === 'multipart/form-data;charset=UTF-8') {
    return data
  } else {
    headers['Content-Type'] = 'application/json'
  }
  return JSON.stringify(data)
}]


// request interceptor
service.interceptors.request.use(
  config => {
    const { headers } = config;
    if (headers['Content-Type'] != "multipart/form-data;charset=UTF-8") {
      let obj = {
        'contractRoot': {
          'svcCont': {
            'requestObject': config.data
          },
          'tcpCont': {
            'appKey': 'string',
            'dstSysId': 'string',
            'reqTime': 0,
            'rspTime': 0,
            'sign': 'string',
            'svcCode': 'string',
            'transactionId': 'string',
            'version': 'string'
          }
        }
      }
      if (config.data) {
        config.data = obj;
      } else if (config.params) {
        config.params = config.params;
      }
    }


    const token = getToken();
    if (token) {
      config.headers['authorization'] = token;
    }



    if (!config.hideLoading) {
      //全局加载
      showFullScreenLoading();
    }



    return config
  },
  error => {
    tryHideFullScreenLoading();
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    //在这里对返回的数据进行处理
    // if (!response) {
    //   goLoginFun();
    // }
    tryHideFullScreenLoading();





    if (response.config.responseType == "arraybuffer") {
      return response.data;
    }
    var infoVal = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;//做一下格式转换
    let info = infoVal.contractRoot.svcCont;
    if (info.resultCode == '0000') {
      if (response.config.responseAll) {
        return info;
      }
      return info.responseObject;
    }
    else if (info.resultCode == '10015') {
      if (window.OUTVUE.prototype.tokenInvalidCallback) {//回调
        window.OUTVUE.prototype.tokenInvalidCallback();
      }
      else {
        removeToken();
        Message.error('token无效，请重新登录！');
        window.OUTVUE.prototype.outRouter.push(`/login`)
      }
    } else {
      let ruleEvents = info.ruleEvents;
      let resultMsg = info.resultMsg;
      if (ruleEvents && ruleEvents instanceof Array && ruleEvents.length > 0) {
        let arr = [];
        ruleEvents.map((item,i) => {
          arr.push('<span style="color: #000;">*</span> ' + item.ruleMsg)
        });
        Message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: arr.join("<br><p style='height: 5px'></p>"),
          type: 'error',
        });
      } else {
        Message.error(resultMsg || '请求异常！');
      }
    }
    return Promise.reject(info);
  },
  error => {
    tryHideFullScreenLoading();
    Message.error('请求异常！');
    return Promise.reject(error)
  }
)

export default service
