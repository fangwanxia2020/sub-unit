// 新增模板
export function addTemplate(data,apiObj) {
  const { url,methodType } = apiObj;
  const type = methodType || 'post';
  return window.OUTVUE.prototype.request({
    url: url || '/association/applytemplate/add',
    method: type,
    [type == 'get' ? 'params' : 'data']: data
  })
}


// 获取模板详细信息
export function getTemplateDetail(data,apiObj) {
  const { url,methodType } = apiObj;
  let newurl = url || '/association/applytemplate/getInfo';
  if (typeof data != 'object') {
    newurl += `/${data}`
  }
  const type = methodType || 'get';
  return window.OUTVUE.prototype.request({
    url: newurl,
    method: type,
    [type == 'get' ? 'params' : 'data']: (typeof data != 'object') ? "" : data
  })
}


// 修改模板
export function editTemplate(data,apiObj) {
  const { url,methodType } = apiObj;
  const type = methodType || 'post';
  return window.OUTVUE.prototype.request({
    url: url || '/association/applytemplate/edit',
    method: type,
    [type == 'get' ? 'params' : 'data']: data
  })
}


