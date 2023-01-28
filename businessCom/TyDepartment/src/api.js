//获取列表
export function getTree(data,apiObj) {
    const { url,methodType, timeout } = apiObj;
    const type = methodType || 'get';
    return window.OUTVUE.prototype.request({
      url: url || '/system/system/dept/getDeptTree',
      method: type,
      [type == 'get' ? 'params' : 'data']: data,
      timeout: timeout || 6e5  // 默认十分钟
    })
  }
  