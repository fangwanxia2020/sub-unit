<template>
  <div>
    <div class="date-content">
      <div class="date-head">
        <el-button
          icon="el-icon-arrow-left"
          @click="backMonth"
          size="mini"
        ></el-button>
        <div>
          <el-date-picker
            v-model="selectMonth"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
            @change="modifyMonth"
          ></el-date-picker>
          <el-button
            type="primary"
            @click="allChange"
            size="mini"
          >全选</el-button>
          <el-button
            type="primary"
            @click="checkedList=[]"
            size="mini"
          >取消</el-button>
          <el-button
            type="primary"
            @click="reverseChange"
            size="mini"
          >反选</el-button>
        </div>
        <el-button
          icon="el-icon-arrow-right"
          @click="goMonth"
          size="mini"
        ></el-button>
      </div>
      <div class="time-content">
        <div
          :class="idx=='5'||idx=='6'?'time-item weekend-item':'time-item'"
          v-for="(week,idx) in weekStyleList"
          :key="idx"
        >{{week}}</div>
      </div>
      <el-checkbox-group
        v-model="checkedList"
        class="day-content"
        @change="handleCheckChange"
      >
        <div
          class="day-item"
          v-for="(i,idx) in (showDateList[0].week==0?6:(showDateList[0].week - 1))"
          :key="'datearr'+idx"
        ></div>
        <el-tooltip
          class="day-item"
          :effect="tooltipEffect"
          :placement="tooltipPlacement"
          v-for="(dateItem,dateIndex) in showDateList"
          :key="dateIndex"
          :disabled="!dateItem.status||!isTooltip"
        >
          <div slot="content">
            <slot
              name="tooltipContent"
              :data="dateItem"
            ></slot>
          </div>
          <el-checkbox-button
            :label="dateItem.date"
            :class="compareCurrent(dateItem.date)?'':'un-active'"
            :disabled="compareCurrent(dateItem.date)?false:true"
            :checked="dateItem.checkStatus"
          >
            <span>{{dateItem.showDate}}</span>
            <div
              v-if="dateItem.status"
              class="set-status"
            >
              <el-button
                size="mini"
                class="set"
                @click="checkSingleDetail(dateItem)"
              >{{checkBtnText}}</el-button>
              <el-button
                size="mini"
                @click="cleanSingleDetail(dateItem)"
                :disabled="!compareCurrent(dateItem.date)"
              >{{cleanBtnText}}</el-button>
            </div>
          </el-checkbox-button>
        </el-tooltip>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import {
  count,
  getCurrentTime
}
from './dataDeal'
export default {
  name: 'TyCustomCalendar',
  props: {
    //可选择的日期范围限制    eg： [YYYY-mm,YYYY-mm] 
    datesRange: {
      type: Array,
      default: () => []
    },
    //是否浮窗展示详情内容 需配合 slot tooltipContent 使用
    isTooltip: {
      type: Boolean,
      default: false
    },
    //浮窗 方向
    tooltipPlacement: {
      type: String,
      default: "right"
    },
    //浮窗样式
    tooltipEffect: {
      type: String,
      default: "dark"
    },
    //已经设置的日历数据 {date:"",status:"",info:""}
    dataList: {
      type: Array,
      default: () => []
    },
    //星期展示风格
    weekStyleList: {
      type: Array,
      default: () => ["周一", "周二", "周三", "周四", "周五", '周六', "周日"]
    },
    //自定义 日期显示格式
    customShowDayFun: {
      type: Function,
      default: (month, day) => {
        // return month+ '月' + day + '日'
        return month + '月' + day + '日'
      }
    },
    //查看详情按钮文案
    checkBtnText: {
      type: String,
      default: "查看详情"
    },
    //清除按钮文案
    cleanBtnText: {
      type: String,
      default: "清除设置"
    },
  },
  data() {
    return {
      selectMonth: '', //选择月份
      currentMonth: "", //当前月份
      checkedList: [], //选中的日期集合
      showDateList: [], //当前月的日期集合
    }
  },
  created() {
    this.init()
  },
  watch: {},
  methods: {
    init() {
      this.currentMonth = getCurrentTime()
      this.selectMonth = this.currentMonth;
      this.initDate();
    },
    //日历初始化
    initDate() {
      let dateBox = []
      //当前月的天数
      const currentCount = count(this.selectMonth)
      //当前月的第一天
      let startTime = new Date(this.selectMonth)
      startTime.setDate(1);
      //当前月的最后一天
      let endTime = new Date(this.selectMonth)
      endTime.setDate(currentCount);
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        let year = startTime.getFullYear();
        let month = (startTime.getMonth() + 1).toString().length == 1 ? "0" + (startTime.getMonth() + 1)
          .toString() : (startTime.getMonth() + 1);
        let day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime
      .getDate();
        let week = startTime.getDay();
        const date = year + "-" + month + "-" + day
        const item = this.dataList.find(item => item.date == date)
        /*数据初始值*/
        dateBox.push({
          showDate: this.customShowDayFun(startTime.getMonth() + 1, startTime.getDate()),
          date: year + "-" + month + "-" + day,
          week: week,
          status: item ? true : false, //状态
          info: item ? item.info : [],
        });
        startTime.setDate(startTime.getDate() + 1);
      }
      this.showDateList = dateBox;
    },
    //月份切换，上一个月
    backMonth() {
      let show = {
        currentMonth: this.selectMonth,
        year: parseInt(this.selectMonth.substring(0, 4)),
        month: parseInt(this.selectMonth.substring(5, 7)),
      };
      let relativeMonth = Math.abs(show.month - 1) % 12
      let relativeYear = Math.floor(Math.abs(show.month - 1) / 12)
      if (this.datesRange.length) {
        const minMonth = parseInt(this.datesRange[0].substring(0, 4)) * 12 + parseInt(this.datesRange[0]
          .substring(5, 7))
        const showMonth = show.year * 12 + show.month
        const maxMonth = parseInt(this.datesRange[1].substring(0, 4)) * 12 + parseInt(this.datesRange[1]
          .substring(5, 7))
        if (showMonth <= minMonth || showMonth > maxMonth) {
          this.$message.warning("超出可选时间范围")
          return
        }
        else {
          if (relativeMonth == 0) {
            relativeMonth = 12
            relativeYear = relativeYear + 1
          }
          this.selectMonth =
            `${show.year-relativeYear}-${relativeMonth.toString().length ==1?"0" +relativeMonth: relativeMonth}`
        }
      }
      else {
        if (relativeMonth == 0) {
          relativeMonth = 12
          relativeYear = relativeYear + 1
        }
        this.selectMonth =
          `${show.year-relativeYear}-${relativeMonth.toString().length ==1?"0" +relativeMonth: relativeMonth}`
      }
      this.initDate();
    },
    //月份切换，下一个月
    goMonth() {
      let show = {
        currentMonth: this.selectMonth,
        year: parseInt(this.selectMonth.substring(0, 4)),
        month: parseInt(this.selectMonth.substring(5, 7)),
      };
      let relativeMonth = Math.abs(show.month + 1) % 12
      let relativeYear = Math.floor(Math.abs(show.month + 1) / 12)
      if (this.datesRange.length) {
        const minMonth = parseInt(this.datesRange[0].substring(0, 4)) * 12 + parseInt(this.datesRange[0]
          .substring(5, 7))
        const showMonth = show.year * 12 + show.month
        const maxMonth = parseInt(this.datesRange[1].substring(0, 4)) * 12 + parseInt(this.datesRange[1]
          .substring(5, 7))
        if (showMonth < minMonth || showMonth >= maxMonth) {
          this.$message.warning("超出可选时间范围")
          return
        }
        else {
          if (relativeMonth == 0) {
            relativeMonth = 12
            relativeYear = relativeYear - 1
          }
          this.selectMonth =
            `${show.year+relativeYear}-${relativeMonth.toString().length ==1?"0" +relativeMonth: relativeMonth}`
        }
      }
      else {
        if (relativeMonth == 0) {
          relativeMonth = 12
          relativeYear = relativeYear - 1
        }
        this.selectMonth =
          `${show.year+relativeYear}-${relativeMonth.toString().length ==1?"0" +relativeMonth: relativeMonth}`
      }
      this.initDate();
    },
    //选择月份
    modifyMonth(e) {
      if (!this.selectMonth) {
        return;
      }
      //日期范围 [YYYY-mm,YYYY-mm] 
      if (this.datesRange.length) {
        const preMonth = parseInt(this.datesRange[0].substring(0, 4)) * 12 + parseInt(this.datesRange[0]
          .substring(5, 7))
        const selectMonth = parseInt(e.substring(0, 4)) * 12 + parseInt(e.substring(5, 7))
        const nextMonth = parseInt(this.datesRange[1].substring(0, 4)) * 12 + parseInt(this.datesRange[1]
          .substring(5, 7))
        if (selectMonth < preMonth || selectMonth > nextMonth) {
          this.$message.warning("超出可选时间范围")
          this.selectMonth = this.currentMonth
        }
      }
      this.initDate();
    },
    //比较与时间区间的大小
    compareCurrent(time) {
      return true;
    },
    //获取已选择的日期
    handleCheckChange(val) {
      this.$emit("handleCheckChange", val)
      this.checkedList = val;
    },
    //反向选择日期
    reverseChange() {
      let checkedList = this.checkedList;
      let dateList = this.showDateList;
      let list = [];
      dateList.map((date) => {
        if (checkedList.indexOf(date.date) == -1 && this.compareCurrent(date.date)) {
          list.push(date.date);
        }
      });
      this.checkedList = list;
      this.$emit("reverseChange", this.checkedList)
    },
    //全选日期
    allChange() {
      let list = [];
      let dateList = this.showDateList;
      dateList.map((date) => {
        if (this.compareCurrent(date.date)) {
          list.push(date.date);
        }
      });
      this.checkedList = list;
      this.$emit("allChange", this.checkedList)
    },
    //点击查看详情按钮 ，回显数据
    checkSingleDetail(dateItem) {
      this.$emit("checkSingleDetail", dateItem)
    },
    //点击清除详情按钮 ，回显数据
    cleanSingleDetail(dateItem) {
      this.$emit("cleanSingleDetail", dateItem)
    },
  },
}
</script>
<style
  lang="scss"
  scoped
>
.date-content {
  margin-bottom: 20px;

  .date-head {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .time-content {
    display: flex;
    flex-flow: nowrap;
    border-left: 1px solid #dcdfe6;

    .time-item {
      background-color: #f1f1f1;
      width: 14.05%;
      padding: 7px 0;
      border-bottom: 1px solid #dcdfe6;
      border-top: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;
      text-align: center;
    }
    
    .weekend-item {
      background-color: #eef5fe;
    }
  }
  
  .day-content {
    display: flex;
    flex-flow: wrap;
    border-left: 1px solid #dcdfe6;

    .day-item {
      /* padding: 5px; */
      width: 14.05%;
      border-bottom: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;

      .item-txt {
        color: #409eff;
        text-align: center;
      }
      
      .day-del-btn {
        background-color: #409EFF;
        color: #fff;
        text-align: center;
        margin-left: 50px;
        line-height: 25px;
        font-size: 12px;
      }
    }
    
    ::v-deep .el-checkbox-button {
      margin-right: 0;
      width: 14.05%;
      height: 99px;
      border-right: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
    }
    
    .set-status {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      padding-top: 14px;

      .el-button--mini {
        padding: 4px 6px;
      }
      
      .el-button--mini.set {
        padding-bottom: 4px 6px;
      }
    }
    
    .un-active {
      background-color: #f1f1f1;
      color: #ccc;

      .item-txt {
        color: #ccc;
      }
    }
  }
  
  ::v-deep .el-checkbox-button__inner {
    border: none;
    width: 100%;
    height: 99px;
    border-bottom: 1px solid #dcdfe6
  }
}
</style>