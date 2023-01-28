export function uploadIMG(url,data, needToken) {
  
  return window.OUTVUE.prototype.request({
    url: url || '/common/uploadOss',
    method: 'post',
    needToken: needToken,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    timeout: 100000000,
    data
  })
}
