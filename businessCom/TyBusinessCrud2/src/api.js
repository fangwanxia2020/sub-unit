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

//获取列表
export function getList(data,apiObj) {
  const { url,methodType, timeout } = apiObj;
  const type = methodType?.toLowerCase() || 'get';
  return window.OUTVUE.prototype.request({
    url: url || '/system/SysDictType/getSysDictTypeLists',
    method: type,
    [type == 'get' ? 'params' : 'data']: data,
    dynamicConfig:appInfo()||{},
    timeout: timeout || 6e5  // 默认十分钟
  })
}

//删除数据
export function delRow(data,apiObj) {
  const { url,methodType } = apiObj;
  let newurl = url || '/system/SysDictType/removeEntityById';
  if (typeof data != 'object') {
    newurl += `/${data}`
  }
  const type = methodType || 'get';
  return window.OUTVUE.prototype.request({
    url: newurl,
    method: type,
    dynamicConfig:appInfo()||{},
    [type == 'get' ? 'params' : 'data']: data
  })
}


//新增数据
export function addRow(data,apiObj) {
  const { url,methodType } = apiObj;
  let newurl = url || '/system/SysDictType/addSysDictType';
  const type = methodType || 'post';
  return window.OUTVUE.prototype.request({
    url: newurl,
    method: type,
    dynamicConfig:appInfo()||{},
    [type == 'get' ? 'params' : 'data']: data
  })
}

//修改数据
export function editRow(data,apiObj) {
  const { url,methodType } = apiObj;
  let newurl = url || '/system/SysDictType/editSysDictType';
  const type = methodType || 'post';
  return window.OUTVUE.prototype.request({
    url: newurl,
    method: type,
    dynamicConfig:appInfo()||{},
    [type == 'get' ? 'params' : 'data']: data
  })
}

// 获取模板配置管理详细信息
export function configurationInfo(templateConfigurationId) {
  //产教提供的接口前缀与配置系统不同，通过动态方式传入接口前缀
  let url=`/configuration/${templateConfigurationId}`
  if(configInfo().prefixUri){
    url=configInfo().prefixUri+url
  }else{
    url="/basic"+url
  }
  return window.OUTVUE.prototype.request({
    url: url,
    method: 'get',
    dynamicConfig:configInfo(),
  })
}

// 批量操作
export function batchOpts(data,apiObj) {
  const { url,methodType } = apiObj;
  let newurl = url
  if (typeof data != 'object') {
    newurl += `/${data}`
  }
  const type = methodType || 'get';
  return window.OUTVUE.prototype.request({
    url: newurl,
    method: type,
    [type == 'get' ? 'params' : 'data']: data,
    dynamicConfig:appInfo()||{},
  })
}


