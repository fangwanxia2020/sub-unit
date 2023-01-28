export const addInstanceMethods = (Vue, options) => {
 /**
 * 判断是否是空对象
 * @param data
 * @returns {boolean}
 */
  Vue.prototype.$isEmptyObj = (data) => {
    return data ? JSON.stringify(data) === '{}' : true;
  };

  /**
 * 格式化时间
 * @param {string} data - 时间戳
 * @param {string} fmt - 转换格式
 * @param {boolean} deleteZero - 是否去除时、分、秒和毫秒中的0（比如：2021-01-14 18:15:00:00 => 2021-01-14 18:15）
 * @returns {string} - 格式化后的时间
 */
  Vue.prototype.$formatDate = (data, fmt = 'yyyy-MM-dd', deleteZero = false) => {
    if (!data) {
      return '';
    }
    let date = new Date(data);
    if (date === null) {
      return "";
    }
    const dateArr = [
      {regExp: 'c+', value: date.getMilliseconds()}, // 毫秒
      {regExp: 's+', value: date.getSeconds()}, // 秒
      {regExp: 'm+', value: date.getMinutes()}, // 分
      {regExp: 'h+', value: date.getHours()}, // 小时
      {regExp: 'd+', value: date.getDate()}, // 日
      {regExp: 'M+', value: date.getMonth() + 1}, // 月份
    ];
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    let _deleteZero = deleteZero;
    dateArr.forEach((item, index) => {
      if (new RegExp("(" + item.regExp + ")").test(fmt)) {
        const matchStr = RegExp.$1;
        const value = item.value;
        // 时、分、秒和毫秒为0时，不显示在最终结果中
        if (index < 4 && _deleteZero && value === 0) {
          fmt = fmt.replace(new RegExp(`[^csmh]?${matchStr}`), '');
          return;
        }
        const length = matchStr.length;
        fmt = fmt.replace(matchStr, (length == 1) ? (value) : ((Array(length + 1).join('0') + value).substr(('' + value).length)));
        if (_deleteZero = true) {
          _deleteZero = false;
        }
      }
    });
    return fmt;
  };
}
