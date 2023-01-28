<script>
// 页面像素
let [lastPixelRatio, currentPixelRatio] = [
  window.devicePixelRatio,
  window.devicePixelRatio,
]
export default {
  name: 'TyWatermark',
  /**
   * 水印遮罩层vue版
   * @Author  hongjm  ylq chencz
   * @Time    2022-11-10
   * @description 使用默认插槽方式制作水印, 支持文字\logo图标, css样式在组件插槽设置行内样式
   * @Version 1.0.0
   * @property {Number | String} angle 倾斜角度
   * @property {Number | String} alpha 遮罩层透明度
   * @property {String} parasite 寄生在什么容器上, 默认为空是在body层 比如: '.right'
   * @property {Number | String} pattern 水印层级 0- body层下 1- 跟随页面/任意容器
   * @description  如parasite填写 得跟pattern配套使用 比如 parasite='.right' pattern=1;
   * @description 插槽样式建议写成行内样式, 有助于监听变化防止篡改 
   * @example <ty-watermark />
   */
  data() {
    return {
      countValue: 1,
      observer: null,
      maskWidth: '110vw',
    }
  },
  props: {
    angle: {
      type: Number | String,
      default: -10,
    },
    alpha: {
      type: Number | String,
      default: 0.2,
    },
    parasite: {
      type: String,
      default: '',
    },
    pattern: {
      type: Number | String,
      default: '0',
    },
    title:{
      type:String,
      default:"水印遮罩"
    },
    waterMarkDomStyle:{
      type:Object,
      default:()=>({
      })
    }
  },
  render(h) {
    return this.createElementFun(h)
  },
  mounted() {
    if (this.pattern == 0) {
      document.body.appendChild(this.$el)
    }
    this._initMaskFun(2)
    window.addEventListener('resize', this._resizeFun)
    this.Monitor()
  },
  methods: {
    // dom创建
    createElementFun(h) {
      let virtualDOM = []
      let style = {
        transform: `rotate(${this.angle}deg)`,
        pointerEvents: 'inherit',
        overflow: 'inherit',
        fontFamily: 'Microsoft YaHei',
        textAlign: 'center',
        boxSizing: 'content-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...this.waterMarkDomStyle
      }
      let waterMarkDom=this.title
      if(this.$slots.default){
         waterMarkDom=this.$slots.default
      }
      // countValue 改变能让render函数重新渲染达到更新dom目的
      for (let i = 0; i < this.countValue; i++) {
            virtualDOM.push(
              h(
                'div',
                { class: 'watermark', style },
                waterMarkDom
                // this.$slots.default && this.$slots.default
              )
            )
      }

      let obj = {
        opacity: this.alpha,
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        overflow: 'hidden',
        zIndex: 99999,
      }
      // 设置成行内样式, 为了能监听样式是否被篡改
      return h('div', { class: 'mask', style: obj }, virtualDOM)
    },
    // DOM改变执行callback
    callback(mutations) {
      let { nextSibling, type, target, oldValue } = mutations[0]
      let { parentNode, offsetParent } = target
      // 判断内容是否被篡改
      switch (type) {
        case 'characterData':
          if (parentNode) {
            if (
              parentNode.offsetParent &&
              parentNode.offsetParent._prevClass === 'watermark'
            ) {
              window.location.reload()
            }
          }
          return
        case 'attributes':
          if (parentNode) {
            if (
              (offsetParent &&
                (offsetParent._prevClass === 'watermark' ||
                  offsetParent._prevClass === 'mask')) ||
              oldValue === 'mask' ||
              target._prevClass === 'mask'
            ) {
              // 判断页面是否正在缩放, 缩放也会导致样式变化, 则不触发
              if (currentPixelRatio === lastPixelRatio) {
                window.location.reload()
              }
              lastPixelRatio = currentPixelRatio
            }
          }
          return
        case 'childList':
          if (target._prevClass === 'mask') {
            if (nextSibling) {
              window.location.reload()
            }
          } else if (offsetParent && offsetParent._prevClass === 'watermark') {
            window.location.reload()
          }
          return
        default:
          break
      }
      // 判断是否删除dom
      if (mutations[0].removedNodes.length) {
        window.location.reload()
      }
    },
    // 监听dom变化
    Monitor() {
      let body = document.getElementsByTagName('body')[0]
      let options = {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
        attributes: true, // 观察属性变动
        characterData: true, // 观察文本变动
        subtree: true, // 观察后代节点
        attributeOldValue: true, // 记录任何有变动的属性的旧值
        characterDataOldValue: true, // 记录任何有变动的属性的旧值
      }
      let observer = new MutationObserver(this.callback)
      observer.observe(body, options) // 监听body节点

      this.$once('hook:beforeDestroy', () => {
        observer.disconnect()
        observer = null
        if (this.pattern == 0) {
          let mask = document.querySelector('.mask')
          mask && document.body.removeChild(mask)
        }
      })
    },
    /**
     * 水印初始化
     * @param {number} index 0-首次加载 1-页面缩放
     */
    _initMaskFun(index = 0) {
      let container = document.body
      if (this.parasite) {
        container = document.querySelector(this.parasite)
      }
      if (container) {
        container.style['userSelect']="none"
        container.style['position']="relative"
        container.style['height']="100vh"
        // 元素获取
        let mask = document.querySelector('.mask')
        let watermark_divAll = document.querySelectorAll('.watermark')
        let watermark_div = watermark_divAll[0]
        if (watermark_div) {
          let [containerWidth, containerHeight] = [
            container.offsetWidth,
            container.offsetHeight,
          ]
          let [watermarkWidth, watermarkHeight] = [
            watermark_div.offsetWidth,
            watermark_div.offsetHeight,
          ]

          // X轴能摆下几个元素
          let residueWidth = containerWidth / watermarkWidth
          // Y轴能摆下几个元素
          let residueHeight = Math.ceil(containerHeight / watermarkHeight)
          // 单个水印元素面积
          let watermarkArea = watermarkWidth * watermarkHeight

          // 动态设置水印父盒子大小, 防止缩放页面水印没覆盖全屏, + watermarkWidth 是为了全部覆盖, 不然右侧可能存在空白情况
          let breadth = 0 // 水印父盒子宽度
          if (this.pattern == 0) {
            breadth = document.body.offsetWidth + watermarkWidth
          } else {
            // 单个水印宽度 * X轴能摆下几个元素 + 单个水印宽度
            breadth = watermarkWidth * Math.ceil(residueWidth) + watermarkWidth
          }
          mask.style.width = breadth + 'px'
          this.maskWidth = mask.style.width
          // 需要摆放几个水印元素 = 父元素面积 / 单个水印面积
          let current = Math.ceil((breadth * containerHeight) / watermarkArea)

          if (index === 1) {
            // 获取外层容器面积大小, 会因页面缩放有所改变
            let outermostArea = containerWidth * containerHeight
            // 获取所有水印元素总面积
            let watermarkAllArea = watermarkArea * watermark_divAll.length
            // 水印元素总面积是否大于当前改变的最外层面积, 减少dom频繁操作
            if (watermarkAllArea < outermostArea) {
              this.countValue = current
            }
          } else {
            this.countValue = current
          }
        }
      }
    },

    // 页面缩放触发, 离开得销毁
    _resizeFun() {
      currentPixelRatio = window.devicePixelRatio
      this._initMaskFun(1)
    },
  },
  destroyed() {
    window.removeEventListener('resize', this._resizeFun)
  },
}
</script>

<style lang="scss" scoped></style>
