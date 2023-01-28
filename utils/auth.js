import Cookies from 'js-cookie';
import * as requestObj from '../api/request';
import * as requestNorObj from '../api/request-normal';
import Vue from 'vue';
window.TOKENKEY = 'ty_token';
window.OUTVUE = Vue;
//初始化方法
export function initApi(val,modal,timeout = 100000) {
  const { router,tokenkey,outVue } = val;
  //设置组件内部vue对象
  window.OUTVUE = outVue;
  const baseurl = outVue.prototype.baseUrl;
  const apiObj = modal == "m1" ? requestObj : requestNorObj;
  const { setBaseUrl,setRouter,setTimeout,default: request } = apiObj;
  //设置baseurl
  setBaseUrl(baseurl);
  //设置路由
  setRouter(router);
  //设置超时时间
  setTimeout(timeout);
  //设置token的变量名
  setTokenKey(tokenkey);
  window.OUTVUE.request = request;
  return request;
}
export function setTokenKey(val) {
  window.TOKENKEY = val;
  return val;
}
export function getToken() {
  return Cookies.get(window.TOKENKEY)
}
export function setToken(token) {
  return Cookies.set(window.TOKENKEY,token)
}
export function removeToken() {
  return Cookies.remove(window.TOKENKEY)
}
