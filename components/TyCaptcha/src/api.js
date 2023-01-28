export function sendMsg(url,params) {
  return window.OUTVUE.prototype.request({
    url: url||'/sendMsg',
    method: 'get',
    params
  })
}
