//统一格式化2019-04-07T16:00:00.000+0000，2020-06-29 14:35:02 格式的日期，输出2020/06/29 14:35:02
function formatTime(date){
  if((typeof date)!="string") return date;
  if(date.indexOf("T")>=0){
      var arr=date.split("T");
       var d=arr[0];
       var darr = d.split('-');  
       var t=arr[1];
       var tarr = t.split('.000');
       var marr = tarr[0].split(':');  
       var dd = parseInt(darr[0])+"/"+parseInt(darr[1])+"/"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
       return dd;
  }
  else{
    return date.replace(new RegExp(/-/gm) ,"/"); 
  }   
}

/**
 *  时间工具类
 */
var DateUtil = {
  /**
   * 当前时间，格式 yyyy-MM-dd HH:mm:ss
   *
   * @return 当前时间的标准形式字符串
   */
  now: function () {
    return new Date().format("yyyy-MM-dd HH:mm:ss");
  },
  /**
   * 格式化日期时间
   * 格式 yyyy-MM-dd HH:mm:ss
   *
   * @param date 被格式化的日期
   * @param format 格式化 参考 {@link date_formate}
   * @return 格式化后的日期
   */
  formatDateTime: function (date, format) {
    if(!date) return "";
    if (format == undefined || format == null) {
      format = "yyyy-MM-dd HH:mm:ss";
    }
    date=formatTime(date);
    return new Date(date).format(format);
  },

  /**
   * 只支持毫秒级别时间戳，如果需要秒级别时间戳，请自行×1000
   *
   * @param timestamp 时间戳
   * @return 时间对象
   */
  date: function (timestamp) {
    return new Date(timestamp);
  }
};

// /** 日期格式 命名参考hutool工具类 */
// const date_formate = {
//   /** 标准日期格式：yyyy-MM-dd */
//   normDatePattern: "yyyy-MM-dd",
//   /** 标准时间格式：hh:mm:ss */
//   normTimePattern: "HH:mm:ss",
//   /** 标准日期时间格式，精确到分：yyyy-MM-dd HH:mm */
//   normDatetimeMinutePattern: "yyyy-MM-dd HH:mm",
//   /** 标准日期时间格式，精确到秒：yyyy-MM-dd HH:mm:ss */
//   normDatetimePattern: "yyyy-MM-dd HH:mm:ss",
//   /** 标准日期时间格式，精确到毫秒：yyyy-MM-dd HH:mm:ss.SSS */
//   normDatetimeMsPattern: "yyyy-MM-dd HH:mm:ss.SSS",
//   /** 标准日期格式：yyyy年MM月dd日 */
//   chineseDatePattern: "yyyy年MM月dd日",
//   /** 标准日期格式：yyyyMMdd */
//   pureDatePattern: "yyyyMMdd",
//   /** 标准日期格式：HHmmss */
//   pureTimePattern: "HHmmss",
//   /** 标准日期格式：yyyyMMddHHmmss */
//   pureDatetimePattern: "yyyyMMddHHmmss",
//   /** 标准日期格式：yyyyMMddHHmmssSSS */
//   pureDatetimeMsPattern: "yyyyMMddHHmmssSSS",
// };

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

export default DateUtil;