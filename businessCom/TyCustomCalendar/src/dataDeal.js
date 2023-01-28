//判断每个月应该有的天数
export function count(selectMonth) {
  let year = parseInt(selectMonth.substring(0, 4))
  let month = parseInt(selectMonth.substring(5, 7))
  if (month != 2) {
    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
      return 30;
    }
    else {
      return 31;
    }
  }
  else {
    if ((year % 4) == 0 && (year % 100) != 0 || year % 400 == 0) {
      return 29;
    }
    else {
      return 28;
    }
  }
}

//获取当前时间
export function getCurrentTime() {
  let currentTime = new Date();
  return currentTime.getFullYear() + '-' + ((currentTime.getMonth() + 1).toString().length ==
  1 ? "0" + (currentTime.getMonth() + 1).toString() : (currentTime.getMonth() + 1));
}

export default {}