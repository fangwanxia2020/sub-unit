//获取列表
export function getList(data,apiObj) {
  const { url,methodType, timeout } = apiObj;
  console.log('poo', url)
  const type = methodType || 'get';
  return window.OUTVUE.prototype.request({
    url: url || '/system/SysDictType/getSysDictTypeLists',
    method: type,
    [type == 'get' ? 'params' : 'data']: data,
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
    [type == 'get' ? 'params' : 'data']: data
  })
}