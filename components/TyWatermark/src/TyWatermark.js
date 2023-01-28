/**
* 水印遮罩层
* @Author  chencz
* @Time    2022-11-09
* @Version 1.0.0
* @使用方式
* 1. mounted生命周期执行 _initFun, _initMaskFun, _resizeFun 。 页面销毁删除 _resizeFun
* 2. 需要给父容器设置position: relative; 定位
* @参考页面
* 2. src\page\learnSystemManage\onlineCourseDetails\index.vue
*/

let containerName = null;
let defaultSettings = null;

/**
 * 水印参数, 只提供部分, 其他有需要的请用css设置
 * @param {object} obj 参数
 */
function _initFun(
    obj = {
        watermark_txt: '天源综合实践学习系统',
        watermark_space: '80px',
        watermark_color: '#000',
        watermark_alpha: '0.2',
        watermark_fontsize: '18px',
        watermark_angle: '-10',
        watermark_textAlign: 'center',
    }
) {
    defaultSettings = obj;
}
// 创建水印元素
function _createMaskFun(current, dom) {
    let { watermark_txt, watermark_space, watermark_color, watermark_alpha, watermark_fontsize, watermark_angle, watermark_textAlign } = defaultSettings;
    let mask_div = null;
    for (let i = 0; i < current; i++) {
        mask_div = document.createElement('div');
        mask_div.className = 'mask';
        mask_div.innerHTML = watermark_txt;
        mask_div.style.visibility = "";
        mask_div.style.padding = watermark_space;
        mask_div.style.color = watermark_color;
        mask_div.style.opacity = watermark_alpha;
        mask_div.style.fontsize = watermark_fontsize;
        mask_div.style.textAlign = watermark_textAlign;
        mask_div.style.transform = `rotate(${watermark_angle}deg)`;
        dom.appendChild(mask_div);
    }
    return { maskDOM: mask_div };
}

/**
 * 水印初始化
 * @param {object} container 父盒子dom元素
 */
function _initMaskFun(container) {
    containerName = container;
    // 获取元素
    let parentContainer = document.querySelector(container);
    if (parentContainer) {
        // 创建水印父盒子容器
        let watermark = document.createElement('div');
        watermark.className = 'watermark';

        let { maskDOM } = _createMaskFun(1, watermark);
        parentContainer.appendChild(watermark);

        // X轴能摆下几个元素
        let residueWidth = parentContainer.offsetWidth / maskDOM.offsetWidth;

        // 设置水印父盒子大小
        watermark.style.width = maskDOM.offsetWidth * Math.ceil(residueWidth) + 'px';

        // 需要摆放几个水印元素 = X轴数量 * Y轴数量
        let current = Math.ceil(residueWidth) * Math.ceil(parentContainer.offsetHeight / maskDOM.offsetHeight) + 1;

        _createMaskFun(current, watermark);
    }
}

// 页面缩放触发, 离开得销毁
function _resizeFun() {
    // 获取元素
    let parentContainer = document.querySelector(containerName);
    let watermark = document.querySelector('.watermark');
    let mask_divAll = document.querySelectorAll('.mask');
    let mask_div = mask_divAll[0];
    if (parentContainer) {
        // 获取right面积大小, 会因页面缩放有所改变
        let rightArea = parentContainer.offsetWidth * parentContainer.offsetHeight;

        // X轴能摆下几个元素
        let residueWidth = parentContainer.offsetWidth / mask_div.offsetWidth;

        // 获取所有水印元素总面积
        let mask_divArea = mask_div.offsetWidth * mask_div.offsetHeight * mask_divAll.length;

        // 动态设置水印父盒子大小, 防止缩放页面水印没全部覆盖
        watermark.style.width = mask_div.offsetWidth * Math.ceil(residueWidth) + 'px';

        // X轴能摆下几个元素
        let current = Math.ceil(residueWidth) * Math.ceil(parentContainer.offsetHeight / mask_div.offsetHeight) + 1;

        // 判断如果水印元素总面积是否大于当前改变的right面积, 减少dom频繁操作
        if (mask_divArea < rightArea) {
            _createMaskFun(current, watermark);
        }
    }
}

export { _initFun, _createMaskFun, _initMaskFun, _resizeFun };