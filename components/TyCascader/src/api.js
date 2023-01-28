export function getGoodsItemLists(url,params,type) {
  return window.OUTVUE.prototype.request({
    url: url || '/system/SysGoodsItems/getGoodsItemLists',
    method: type || 'get',
    [type == 'get' ? 'params' : 'data']: params,
    hideLoading: true
  })
}
