<template>
  <div class="ty-table">
    <slot name="table_oper" />
    <slot name="btns_bar" />
    <el-table
      ref="tyTableObj"
      tooltip-effect="light"
      :size="size"
      :row-class-name="tableRowClassName"
      :span-method="spanMethodFun"
      :row-key="id"
      :tree-props="treeProps"
      :lazy="lazy"
      :load="load"
      :data="data"
      :max-height="maxHeight"
      :border="border"
      :stripe="stripe"
      :default-sort="defaultSort"
      :default-expand-all="defaultExpandAll"
      @current-change="selectTableList"
      @select="handleSelectFun"
      @select-all="handleTableSelectAll"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChage"
    >
      <el-table-column
        type="expand"
        v-if="showExpand"
      >
        <template slot-scope="props">
          <slot
            name="expand"
            :data="(props.row)"
          > 展开的内容 </slot>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="50"
        v-if="showSelect"
        :selectable='checkboxInit'
      ></el-table-column>
      <el-table-column
        type="index"
        width="50"
        label="序号"
        v-if="showIndex"
        :index="indexMethod"
      ></el-table-column>
      <template v-for="(item, index) in tableColumns">
        <el-table-column
          v-if="item.show != false"
          :key="index"
          :fixed="item.fixed"
          :prop="item.prop"
          :label="item.label"
          :sortable="item.sortable || false"
          :align="item.align"
          :width="item.width"
          :formatter="item.formatter ? item.formatter : formatterValue"
          :show-overflow-tooltip="item.showOverflowTooltip"
        >
          <template v-slot:header> <template v-if="!item.labelSlot">{{item.label}}</template>
            <template v-else>
              <slot :name="`label-${item.prop}`">{{item.label||'标题'}}</slot>
            </template>
          </template>
          <template slot-scope="scope">
            <div v-if="item.type=='slot'">
              <slot
                :name="item.prop"
                :data="scope.row"
                :index="scope.$index"
                v-bind="scope"
              ></slot>
            </div>
            <el-link
              type="primary"
              v-else-if="item.type=='link'"
            >
              <a :href="scope.row[scope.column.property].href">{{scope.row[scope.column.property].val}}</a>
            </el-link>
            <div v-else-if="item.type=='image'">
              <el-image
                style="width:50px; height:50px"
                :src="scope.row[scope.column.property]"
                fit="cover"
              ></el-image>
            </div>
            <div v-else-if="item.type=='money'">{{toMoney(scope.row[scope.column.property])}}</div>
            <div v-else-if="item.type=='num'">{{toNum(scope.row[scope.column.property],item.bit)}}</div>
            <span
              v-else-if="['datetime','date','month','year','time','date&time'].indexOf(item.type)>=0">{{toDateUtil(scope.row[scope.column.property],item.type)}}</span>
            <div v-else-if="item.type=='operation'">
              <slot
                name="operation"
                v-bind="scope"
              >
                <el-button
                  @click="handleEdit(scope.row)"
                  size="small"
                >编辑</el-button>
                <el-button
                  @click="handleDelete(scope.row)"
                  size="small"
                  type="danger"
                >删除</el-button>
              </slot>
            </div>
            <span
              v-else-if="item.formatter">{{item.formatter(scope.row[scope.column.property],scope.row)}}</span>
            <span v-else>{{scope.row[scope.column.property]}}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="!hidePage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="text-align: center;margin:20px 0;"
      :current-page="pager.pageNo"
      :page-size="pager.limit"
      :page-sizes="pager.sizes"
      :pager-count="pager.count"
      :total="pager.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>
<script>
/**
 * 组件名称 TyTable
 * @module components/data/TyTable
 * @desc 列表组件带分页 
 * @author lyt
 * @date 2020年06月19日 15:00
 * @param {Array} [columns]    - 表头
 * @param {Array} [data] - 数据
 * @param {Object} [pager] - 分页
 * @param {Number} [maxHeight] - 最大高度
 * @param {Boolean} [showSelect] - 是否显示复选框
 * @param {Boolean} [showIndex] - 是否显示序号
 * @param {Boolean} [hidePage] - 是否隐藏分页
 * @example 调用示例
 *   <ty-table
        ref="tableObj"
        :showSelect="true"
        :columns="columns"
        :data="tableData"
        :pager="page"
        @selectionChange="selectionChange"
        @pageSizeChange="handleSizeChange"
        @pageCurrentChange="handleCurrentChange"
        @selectTableList="selectTableList"
        @editRow="editRowFun"
        @delRow="delRowFun"
      ></ty-table>
 **/
import DateUtil from "utils/date";
export default {
  name: "TyTable",
  props: {
    //Table 的尺寸medium / small / mini
    size: {
      type: String,
      default: "medium"
    },
    //判断唯一性的值
    id: {
      type: String,
      default: "id"
    },
    //checkbox选中列表
    checkList: {
      type: Array,
      default: () => []
    },
    //表头
    columns: Array,
    //数据
    data: Array,
    //分页
    pager: {
      type: Object,
      default: () => {
        return {
          pageNo: 1,
          limit: 5,
          sizes: [5, 10, 20],
          total: 0,
          count: 7,
        };
      }
    },
    //最大高度
    maxHeight: {
      type: Number
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: true
    },
    //是否显示斑马线
    stripe: {
      type: Boolean,
      default: true
    },
    //显示复选框
    showSelect: {
      type: Boolean,
      default: false
    },
    //显示序号
    showIndex: {
      type: Boolean,
      default: true
    },
    //隐藏分页
    hidePage: {
      type: Boolean,
      default: false
    },
    //控制合并单元格
    //  方法的参数是一个对象，里面包含当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性。
    //  该函数可以返回一个包含两个元素的数组，第一个元素代表rowspan，第二个元素代表colspan。 
    //  也可以返回一个键名为rowspan和colspan的对象。
    //  row, column, rowIndex, columnIndex
    spanControl: {
      type: Function
    },
    //控制可以勾选复选框,方法需要返回true,或者false
    checkboxControl: {
      type: Function
    },
    //控制行的样式
    rowClassNameControl: {
      type: Function
    },
    //是否展开行
    showExpand: {
      type: Boolean,
      default: false
    },
    //树形渲染嵌套数据的配置选项
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          hasChildren: 'hasChildren'
        };
      }
    },
    //是否懒加载子节点数据
    lazy: {
      type: Boolean,
      default: false
    },
    //加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息(Promise方法)
    loadTree: {
      type: Function
    },
    // 所有居中方式
    allAlign: {
      type: String,
      default: ''
    },
    // 默认的排序列的 prop 和顺序。它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
    defaultSort: {
      type: Object,
      default () {
        return {
          prop: '',
          order: ''
        }
      }
    },
    // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
    defaultExpandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allPageSelection: this.checkList || [], //checkbox选中的行包含分页选中的
      multipleSelection: [], //当前checkbox选中的行
      currentRow: null,
      tableColumns: this.columns
    };
  },
  watch: {
    columns(val) {
      this.tableColumns = val
    },
    allPageSelection(val) {
      this.handleAllSelectionChange(val);
    },
    data(val) {
      this.allPageSelection = this.checkList || [];
      this.multipleSelection = null;
      this.$nextTick(() => this.changeRowSelection(this.allPageSelection, this.id))
    },
    multipleSelection: {
      handler(val, oldval) {
        //console.log(val, oldval, "00000jjj");
        if (this.multipleSelection == null) return; //避免切换分页的时候重置值
        if (!val) val = [];
        if (!oldval) oldval = [];
        const selList = this.allPageSelection.concat(val); //复制一个备份并且
        if (oldval.length > val.length) { //删除
          const delItem = oldval.filter(item => {
            const isDel = val.findIndex(o => o[this.id] == item[this.id]) < 0;
            const inPage = this.data.findIndex(o => o[this.id] == item[this.id]) >= 0
            return isDel && inPage;
          });
          if (delItem.length > 0) {
            delItem.forEach(obj => {
              const delIndex = selList.findIndex(item => item[this.id] == obj[this.id]);
              if (delIndex >= 0) {
                selList.splice(delIndex, 1);
              }
            });
          }
        }
        else { //添加
          const addItem = val.filter(item => !oldval.includes(item));
          if (addItem.length > 0) {
            addItem.forEach(obj => {
              selList.push(obj);
            });
          }
        }
        this.allPageSelection = this.unique(selList); //去重
      },
      deep: true
    },
  },
  created() {
    this.tableColumns = this.columns
  },
  methods: {
    // 列表序号自定义
    indexMethod(index) {
      let curIdx = index + 1
      // (当前页-1)*每页条数+1----> 做第一个编号 然后循环+1;
      let idx = ((this.pager.pageNo - 1) * this.pager.limit) + curIdx
      return idx
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (this.rowClassNameControl) {
        return this.rowClassNameControl({
          row,
          rowIndex
        });
      }
      return '';
    },
    //合并单元格
    spanMethodFun(spanObj) {
      if (this.spanControl) {
        return this.spanControl(spanObj);
      }
      return {
        rowspan: 1,
        colspan: 1
      };
    },
    //加载树节点数据
    async load(tree, treeNode, resolve) {
      if (this.loadTree) {
        const treeVal = await this.loadTree();
        resolve(treeVal || []);
      }
      else {
        resolve([]);
      }
    },
    //控制复选框是否可以编辑
    checkboxInit(row, index) {
      if (this.checkboxControl) {
        if (this.checkboxControl(row, index)) {
          return 1;
        }
        else {
          return 0;
        }
      }
      return 1;
    },
    //数组去重
    unique(arr) {
      //console.info('原始数组：', arr);
      const hash = {};
      const newArray = arr.reduce((item, next) => {
        hash[next[this.id]] ? '' : hash[next[this.id]] = true && item.push(next);
        return item;
      }, [])
      //console.info('去重后的数组:', newArray);
      return newArray
    },
    // 数字
    toNum(val, bit) {
      if (typeof val == 'number' || typeof val == 'string') {
        val = Number(val)
        if (bit == undefined) {
          return val.toFixed(2);
        }
        else {
          return val.toFixed(bit);
        }
      }
      else {
        return ''
      }
    },
    // 价格
    toMoney(val) {
      return "¥" + " " + (+val).toFixed(2);
    },
    toDateUtil(val, t) {
      let type = "yyyy-MM-dd HH:mm:ss";
      switch (t) {
        case "date":
          type = "yyyy-MM-dd";
          break;
        case "month":
          type = "yyyy-MM";
          break;
        case "year":
          type = "yyyy";
          break;
        case "time":
          type = "HH:mm";
        case "date&time":
          type = "yyyy-MM-dd HH:mm";
          break;
      }
      if (val) {
        return DateUtil.formatDateTime(val, type);
      }
      return val;
    },
    //选中复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selectionChange", val);
    },
    //选中复选框包含分页的选中值
    handleAllSelectionChange(val) {
      let vv = [].concat(val); //.sort((a, b) => a[this.id] - b[this.id]);
      this.$emit("update:checkList", vv);
      this.$emit("allSelectionChange", vv);
    },
    //改变分页大小
    handleSizeChange(val) {
      this.$emit("pageSizeChange", val);
    },
    //切换页数
    handleCurrentChange(val) {
      this.$emit("pageCurrentChange", val);
    },
    formatterValue(row, column, cellValue) {
      return cellValue;
    },
    //当前选中行发生改变
    selectTableList(val) {
      this.currentRow = val;
      this.$emit("selectTableList", val);
    },
    //编辑行
    handleEdit(row) {
      this.$emit("editRow", row);
    },
    //删除行
    handleDelete(row) {
      this.$emit("delRow", row);
    },
    //ty-table方法,删除已选的Selection数据(一般在已选列表中的删除使用)
    delSelection(item) {
      //删掉此项数据
      if (this.data.findIndex(obj => obj[this.id] == item[this.id]) >= 0) {
        //当在此页的数据
        const list = this.allPageSelection.filter(obj => obj[this.id] != item[this.id]);
        this.changeRowSelection(list, this.id);
      }
      else {
        this.allPageSelection = this.allPageSelection.filter(obj => obj[this.id] != item[this.id]);
      }
    },
    //ty-table方法,选中当前行
    changeRowSelection(rows, tag) {
      //tag是为了解决分页选不上的问题,表示判断两个对象相等的唯一标识
      if (!this.$refs.tyTableObj) return;
      this.$refs.tyTableObj.clearSelection();
      if (rows && rows.length > 0) {
        const dataRows = []
        this.data.forEach(dataRow => { // 当前能选上的父节点
          for (const row of rows) {
            // 为了实现不是全等的id，只能用这种低端方法
            if (dataRow[tag] == row[tag]) {
              dataRows.push(dataRow)
            }
          }
        })
        this.recursiveSelect(dataRows, true)
      }
      this.allPageSelection = rows || [];
    },
    handleSelectFun(selection, row) {
      if (row[this.treeProps.children]) {
        this.handleTableSelect(selection, row)
      }
      this.$emit('select', {
        selection,
        row
      });
    },
    handleTableSelectAll(selection) {
      if (selection && selection.length && selection.length === this.data.length) {
        selection.forEach(row => this.handleTableSelect(selection, row))
      }
      else {
        this.$refs.tyTableObj.clearSelection()
      }
      this.$emit('select-all', selection)
    },
    handleTableSelect(selection, row) {
      const {
        id,
        treeProps
      } = this
      const children = row[treeProps.children]
      if (!children) return
      const selectionIds = selection.map(row => row[id])
      const isSelected = selectionIds.includes(row[id]) // 选中与反选
      setTimeout(() => this.recursiveSelect(children, isSelected), 10) // 为了能把选中的行的子节点也选上需要延迟执行
    },
    /**
     * 递归选中表格多选框中的子项
     * @param {Object[]} rows 传入的原始数行，注意，必须要拿原始传给 el-table 的 data 来作为行进行选中
     * @param {Boolean} isSelected 是否选中
     */
    recursiveSelect(rows, isSelected) {
      const {
        treeProps,
        $refs
      } = this
      const childrenKey = treeProps.children
      if (!rows) return
      rows.forEach(row => {
        $refs.tyTableObj.toggleRowSelection(row, isSelected)
        if (row[childrenKey]) {
          this.recursiveSelect(row[childrenKey], isSelected)
        }
      })
    },
    /**
     * 当表格的排序条件发生变化的时候会触发该事件
     * @param {Object} event 事件对象
     * @param {Object[]} event.column 表格列数据
     * @param {string} event.prop 属性名
     * @param {string} event.order 顺序
     */
    handleSortChage(event) {
      this.$emit('sort-change', event)
    }
  }
};

</script>
<style
  scoped
  lang="scss"
>
.ty-table {

  /* 在IE下 table 表格宽度不是100%的问题 */
  ::v-deep .el-table__header {
    width: 100% !important;
  }
  
  ::v-deep .el-table__body {
    width: 100% !important;
  }
  
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: #ebeaeaad;
    border-radius: 20px;
  }
}

</style>
