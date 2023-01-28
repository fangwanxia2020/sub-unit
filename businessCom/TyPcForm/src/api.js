//获取第三方的请求信息 包括url，token等
const appInfo=()=>{
  return JSON.parse(localStorage.getItem("AppInfo")) ||{}
}

//获取 业务系统获取配置模板系统的urk，token等
const configInfo=()=>{
  if(localStorage.getItem("configInfo")&&Object.keys(JSON.parse(localStorage.getItem("configInfo"))).length){
    return JSON.parse(localStorage.getItem("configInfo"))
  } else if(localStorage.getItem("AppInfo")&&JSON.parse(localStorage.getItem("AppInfo")).prefixUri){
    //获取配置系统中配置的接口请求前缀
    return { prefixUri:JSON.parse(localStorage.getItem("AppInfo")).prefixUri }
  }else{
    return {}
  }
}

// 获取模板详细信息
export function handleTemplateRequest(data,apiObj) {
  const { url,methodType } = apiObj;
  let newurl = url || '/association/applytemplate/getInfo';
  if (typeof data != 'object') {
    newurl += `/${data}`
  }
  const type = methodType || 'get';
    //产教提供的接口前缀与配置系统不同，通过动态方式传入接口前缀
    let sliceUrl=newurl.replace("/basic","")
    if(configInfo().prefixUri){
      newurl=configInfo().prefixUri+sliceUrl
    }
  return window.OUTVUE.prototype.request({
    url: newurl,
    method: type,
    [type == 'get' ? 'params' : 'data']: (typeof data != 'object') ? "" : data,
     dynamicConfig:configInfo(),
  })
}
//将原先同个方法拆分成两个 对于模板查询和业务方的接口调用做区分 -ylq 2022/11/09

// 提交模板内容
export function submitTemplateRequest(data,apiObj) {
  const { url,methodType } = apiObj;
  let newurl = url || '/association/applytemplate/getInfo';
  if (typeof data != 'object') {
    newurl += `/${data}`
  }
  const type = methodType || 'get';
  return window.OUTVUE.prototype.request({
    url: newurl,
    method: type,
    [type == 'get' ? 'params' : 'data']: (typeof data != 'object') ? "" : data,
    dynamicConfig:appInfo() ||{},
  })
}