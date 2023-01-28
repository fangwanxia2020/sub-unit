export function uploadFile(url, method, data, onUploadProgress, needToken, timeout) {
  return window.OUTVUE.prototype.request({
    url,
    method,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'//application/x-www-form-urlencoded
    },
    needToken,
    onUploadProgress,
    timeout,
    data
  })
}
