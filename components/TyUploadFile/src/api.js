//获取第三方的请求信息 包括url，token等
const appInfo=()=>{
  return JSON.parse(localStorage.getItem("AppInfo")) ||{}
}
export function uploadFile(url, method, data, onUploadProgress, needToken, timeout,dynamicConfig) {
  return window.OUTVUE.prototype.request({
    url,
    method,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'//application/x-www-form-urlencoded
    },
    needToken,
    onUploadProgress,
    dynamicConfig:dynamicConfig?appInfo()||{}:{},
    timeout,
    data
  })
}
