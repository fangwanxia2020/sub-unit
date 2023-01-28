<template>
  <ty-business-crud
    show-search
    searchMode="default"
    id="id"
    @resetSearch="resetSearch"
    @checkedChange="checkedChange"
    @highSearchChange="highSearchChangeFun"
    :getListInterface="getListInterface"
    ref="jsCrudObj"
    :showSelect="true"
    :showIndex="true"
    :showSearchFields="['dictType', 'dictName', 'remark', 'status', 'updateBy']"
    :delInterface="{
      url: '/system/SysDictType/removeEntityById',
      methodType: 'get',
      resFormatFun: resFormatFun
    }"
  >
    <template slot="dictType" slot-scope="{ data }">
      <span style="color: #f90">{{ data.dictName }}</span>
    </template>
    <span slot="operator" style="margin-left: 10px">
      <el-button @click="getEmpty">清空</el-button>
      <el-button @click="getCheckList">导出</el-button>
    </span>
    <template slot="search">
      <template v-if="searchDateRangShow">
        <span class="el-form-item el-form-item--medium search-item">
          <label>创建时间asaasasas：</label>
          <div class="search-item-ctn">
            <el-date-picker
              size="small"
              style="width: 100%"
              v-model="searchDateRang"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </span>
        <span class="el-form-item el-form-item--medium search-item">
          <label>创建时间：</label>
          <div class="search-item-ctn">
            <el-date-picker
              size="small"
              style="width: 100%"
              v-model="searchDateRang"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </span>
      </template>
    </template>
    <template v-slot:rowOperator="scope">
      <el-button type="text" @click="editFun(scope.row)">插槽按钮</el-button>
    </template>
  </ty-business-crud>
</template>
<script>
export default {
  name: 'design',
  data() {
    return {
      searchDateRangShow: false,
      searchDateRang: [],
      getListInterface: {
        params: {},
        resFormatFun: this.resFormatFun
      },
      tableData: [
        {
          title: '标题1',
          content: '内容1',
          id: '1',
          children: [
            {
              title: '标题1-1',
              content: '内容1-1',
              id: '1-1',
            },
            {
              title: '标题1-2',
              content: '内容1-2',
              id: '1-2',
              children: [
                {
                  title: '标题1-2-1',
                  content: '内容1-2-1',
                  id: '1-2-1',
                },
                {
                  title: '标题1-2-2',
                  content: '内容1-2-2',
                  id: '1-2-2',
                }
              ]
            }
          ]
        },
        {
          title: '标题2',
          content: '内容2',
          id: '2'
        }
      ]
    }
  },
  watch: {
    searchDateRang(timeRang) {
      if (timeRang && timeRang.length > 0) {
        this.getListInterface.params.createTime = '2020-12-08 00:00' //DateUtil.formatDateTime(timeRang[0], "yyyy-MM-dd HH:mm");
        this.getListInterface.params.endTime = '2020-12-08 00:00' //DateUtil.formatDateTime(timeRang[0], "yyyy-MM-dd HH:mm");
      } else {
        delete this.getListInterface.params.createTime
        delete this.getListInterface.params.endTime
      }
    }
  },
  mounted() {
    this.$refs.jsCrudObj.tableData = this.tableData
    this.$refs.jsCrudObj.setCheckList([{ id: 1 }])
  },
  methods: {
    resFormatFun(res) {
      return {
        list: res.data.records,
        total: res.data.total
      }
    },
    //高级搜索切换展开收起方法
    highSearchChangeFun(val) {
      this.searchDateRangShow = val
    },
    getEmpty() {
      this.$refs.jsCrudObj.setCheckList([])
    },
    checkedChange(checklist) {
      this.checklist = checklist
    },
    getCheckList() {
      const aa = this.$refs.jsCrudObj.getCheckList()
      alert(JSON.stringify(aa))
    },
    editFun(row) {
      alert(JSON.stringify(row))
    },
    resetSearch() {
      this.searchDateRang = []
      delete this.getListInterface.params.createTime
      delete this.getListInterface.params.endTime
    }
  }
}
</script>
