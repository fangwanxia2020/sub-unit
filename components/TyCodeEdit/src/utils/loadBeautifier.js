import loadScript from 'utils/loadScript'
import ELEMENT from 'element-ui'

window.beautifierObj=null;

export default function loadBeautifier(cb) {
  if (window.beautifierObj) {
    cb(window.beautifierObj)
    return
  }

  const loading = ELEMENT.Loading.service({
    fullscreen: true,
    lock: true,
    text: '格式化资源加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })
  loadScript('https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/js-beautify/1.10.2/beautifier.min.js',() => {
    loading.close()
    // eslint-disable-next-line no-undef
    window.beautifierObj= beautifier;
    cb(window.beautifierObj)
  })
}
