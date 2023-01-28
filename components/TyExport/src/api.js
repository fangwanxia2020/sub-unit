//获取第三方的请求信息 包括url，token等
const appInfo=()=>{
  return JSON.parse(localStorage.getItem("AppInfo")) ||{}
}
export function exportFile(url,data,timeout,method,dynamicConfig) {
  return window.OUTVUE.prototype.request({
    url,
    method,
    [method === 'get' ? 'params' : 'data']: data,
    responseType: "arraybuffer",
    timeout:timeout||300000,
    dynamicConfig:dynamicConfig?appInfo()||{}:{},
  })
}
