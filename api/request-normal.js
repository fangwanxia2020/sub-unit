import axios from 'axios';
import JSONBIG from 'json-bigint'
import { Message } from 'element-ui';
import { getToken, removeToken } from '../utils/auth';
import {
  showFullScreenLoading,
  tryHideFullScreenLoading
} from './loading';
import qs from 'qs'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 10000,
})
export const setBaseUrl = (url) => {
  window.OUTVUE.prototype.baseURL = url;
  service.defaults.baseURL = window.OUTVUE.prototype.baseURL;
};

export const setTimeout = (val)=> {
  service.defaults.timeout = val;
}

export const setRouter = (router) => {
  window.OUTVUE.prototype.outRouter = router;
};
//支持formData其他提交形式
service.defaults.transformRequest = [function (data, headers) {
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    // 把一个参数对象格式化为一个字符串
    return qs.stringify(data)
  }
  else if (headers['Content-Type'] === 'multipart/form-data;charset=UTF-8') {
    return data
  }
  else {
    headers['Content-Type'] = 'application/json'
  }
  return JSON.stringify(data)
}]
//可以通过axios的transformResponse方法，这个方法的作用是在传递给then/catch前，允许修改响应数据
//axios在这里默认把响应体从json字符串转成了js对象
// 返回headers让导出组件能获取
service.defaults.transformResponse = [function (data, headers) {
  // console.log('api',data)//这里的data是字符串，在这个字符串的是没有丢失精度的，所以需要在这里先把精度调好
  try {
    //作用1：把json字符串转为js对象
    //作用2：把里面的大数字做安全处理
    return JSONBIG({ storeAsString: true }).parse(data, headers)
  }
  catch (err) {
    // 如果转换失败，则包装为统一数据格式并返回
    return {data, headers}
  }
}]
// request interceptor
service.interceptors.request.use(config => {
  // console.log('config', config)
  const {
    headers
  } = config;
  if (headers['Content-Type'] != "multipart/form-data;charset=UTF-8") {
    if (config.data) {
      config.data = config.data;
    }
    else if (config.params) {
      config.params = config.params;
    }
  }

  //只针对get方式进行序列化
  if (config.method === 'get') {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, {
        arrayFormat: 'repeat'
      })
    }
  }

  const token = getToken();
  if (token) {
    config.headers['Authorization'] = token;
  } 
  // 模板配置  动态获取第三方url  -ylq 2022/11/08
  if(config.dynamicConfig&&Object.keys(config.dynamicConfig).includes("url")) {
    const {url,apiToken}=config.dynamicConfig
    config.headers['Authorization'] = apiToken||"";
    config.baseURL=url
  }
  // 支持请求header不添加token
  // console.log('header',Number(config.needToken))
  if (Number(config.needToken) == 0) {
    // config.headers['Authorization'] = ''
    delete config.headers['Authorization']
  }
  if (!config.hideLoading) {
    //全局加载
    showFullScreenLoading();
  }
  return config
}, error => {
  tryHideFullScreenLoading();
  return Promise.reject(error)
})
// response interceptor
service.interceptors.response.use(response => {
  //在这里对返回的数据进行处理
  // if (!response) {
  //   goLoginFun();
  // }
  // response.setHeader("Access-Control-Expose-Headers","Content-Disposition");
  tryHideFullScreenLoading();
  let info = response.data;
  const code = info.code || 200;
  if (response.config.responseType == "arraybuffer") {
    return info;
  }
  // 开发同事自行处理返回信息，eg:个别场景需要对报错信息进行个性处理 -- 2022.08.30 by hjm
  else if (response.config.failBack == "1") {
    return info;
  }
  else if (code == '200') {
    return info;
  }
  else if (code == '401') {
    if (window.OUTVUE.prototype.tokenInvalidCallback) { //回调
      window.OUTVUE.prototype.tokenInvalidCallback();
    }
    else {
      removeToken();
      // 模板配置 清楚第三方 token -ylq 2022/11/08
      localStorage.removeItem('AppInfo');
      localStorage.removeItem('configInfo');
      Message.error('token无效，请重新登录！');
      window.OUTVUE.prototype.outRouter.push(`/login`)
    }
  }
  // 增加错误信息处理  -- 2022.09.07 - by hjm
  else if (code == '900') {
    Message.error('服务器正在重启，请稍后！');
  }
  else {
    Message.error(info.msg || '请求异常！');
  }
  return Promise.reject(info);
}, error => {
  let info =error?.response?.data;
  tryHideFullScreenLoading();
  // 针对在后端返回不同http状态码需做进一步处理操作的情况下，通过在对应项目内定义以下方法进行相应的处理操作 -- 2022.09.01 by ylq
  if (window.OUTVUE.prototype.httpErrCallback) { 
    window.OUTVUE.prototype.httpErrCallback(error);
  }else{
    Message.error(info?.msg|| '请求异常！');
  }
  return Promise.reject(error)
})
export default service
