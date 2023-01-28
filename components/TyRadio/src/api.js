export function apiGetList(url,params,type) {
  return window.OUTVUE.prototype.request({
    url: url || '/system/SysDictData/getChildrenItemsByDictType',
    method: type || 'get',
    params
  })
}
