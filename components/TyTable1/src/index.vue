<template>
  <div class="ty-table">
    <slot name="table_oper" />
    <el-table
      :size="size"
      ref="tyTableObj"
      :row-class-name="tableRowClassName"
      :span-method="spanMethodFun"
      :row-key="id"
      :tree-props="treeProps"
      :lazy="lazy"
      :load="load"
      @current-change="selectTableList"
      :data="data"
      :max-height="maxHeight"
      :height="height"
      :border="border"
      :stripe="stripe"
      :tooltip-effect="tooltipEffect"
      :default-expand-all="defaultExpandAll"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @select="handleSelectFun"
      @sort-change="sortChange"
      @filter-change="filterHandler"
      @row-click="rowClick"
      :header-cell-class-name="multipleSort ? handleHeaderCellClass : ''"
    >
      <el-table-column type="expand" v-if="showExpand">
        <template slot-scope="props">
          <slot name="expand" :data="props.row"> 展开的内容 </slot>
        </template>
      </el-table-column>
 <!--table复选框上下居中对齐-- 2022.09.09- by ylq -->
      <el-table-column
        type="selection"
        width="50"
        align="center"  
        v-if="showSelect"
        :selectable="checkboxInit"
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
          :filtered-value="item.filteredValue"
          :key="index"
          :fixed="
            item.fixed != null && item.fixed != undefined ? item.fixed : false
          "
          :prop="item.prop"
          :label="item.label"
          :align="
            item.align
              ? item.align
              : item.prop == 'operation'
              ? 'right'
              : allAlign
              ? allAlign
              : 'center'
          "
          :width="item.width"
          :formatter="item.formatter ? item.formatter : formatterValue"
          :show-overflow-tooltip="
            item.showOverflowTooltip != null &&
            item.showOverflowTooltip != undefined
              ? item.showOverflowTooltip
              : true
          "
          :sortable="item.sortable"
          :filters="item.filters"
          :column-key="item.prop"
        >
          <template v-slot:header>
            <template v-if="!item.labelSlot">{{ item.label }}</template>
            <template v-else>
              <slot :name="`label-${item.prop}`">{{
                item.label || "标题"
              }}</slot>
            </template>
          </template>
          <template slot-scope="scope">
            <div v-if="item.type == 'slot'">
              <slot :name="item.prop" :data="scope.row"></slot>
            </div>
            <el-link type="primary" v-else-if="item.type == 'link'">
              <a :href="scope.row[scope.column.property].href">{{
                scope.row[scope.column.property].val
              }}</a>
            </el-link>
            <div v-else-if="item.type == 'image'">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row[scope.column.property]"
                fit="cover"
                :preview-src-list="scope.row[scope.column.property]?[scope.row[scope.column.property]]:[]"
              ></el-image>
            </div>
            <div v-else-if="item.type == 'money'">
              {{ toMoney(scope.row[scope.column.property]) }}
            </div>
            <span
              v-else-if="
                ['datetime', 'date', 'month', 'year', 'time'].indexOf(
                  item.type
                ) >= 0
              "
              >{{
                toDateUtil(scope.row[scope.column.property], item.type)
              }}</span
            >
            <div v-else-if="item.type == 'operation'">
              <slot name="operation" v-bind:row="scope.row">
                <el-button @click="handleEdit(scope.row)" size="small"
                  >编辑</el-button
                >
                <el-button
                  @click="handleDelete(scope.row)"
                  size="small"
                  type="danger"
                  >删除</el-button
                >
              </slot>
            </div>
            <span v-else-if="item.formatter">{{
              item.formatter(scope.row[scope.column.property], scope.row)
            }}</span>
            <span v-else>{{ scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="!hidePage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="text-align: center; margin: 20px 0"
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
  name: "TyTable1",
  props: {
    //Table 的尺寸medium / small / mini
    size: {
      type: String,
      default: "medium",
    },
    //判断唯一性的值
    id: {
      type: String,
      default: "id",
    },
    //checkbox选中列表
    checkList: {
      type: Array,
      default: () => [],
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
      },
    },
    //最大高度
    maxHeight: {
      type: Number,
    },
  //表格高度
    height:{
      type: String | Number
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: false,
    },
    //是否显示斑马线
    stripe: {
      type: Boolean,
      default: false,
    },
    //显示复选框
    showSelect: {
      type: Boolean,
      default: false,
    },
    //显示序号
    showIndex: {
      type: Boolean,
      default: false,
    },
    //隐藏分页
    hidePage: {
      type: Boolean,
      default: false,
    },
    //控制合并单元格
    //  方法的参数是一个对象，里面包含当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性。
    //  该函数可以返回一个包含两个元素的数组，第一个元素代表rowspan，第二个元素代表colspan。
    //  也可以返回一个键名为rowspan和colspan的对象。
    //  row, column, rowIndex, columnIndex
    spanControl: {
      type: Function,
    },
    //控制可以勾选复选框,方法需要返回true,或者false
    checkboxControl: {
      type: Function,
    },
    //控制行的样式
    rowClassNameControl: {
      type: Function,
    },
    //是否展开行
    showExpand: {
      type: Boolean,
      default: false,
    },
    //树形渲染嵌套数据的配置选项
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          hasChildren: "hasChildren",
        };
      },
    },
    //是否懒加载子节点数据
    lazy: {
      type: Boolean,
      default: false,
    },
    //加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息(Promise方法)
    loadTree: {
      type: Function,
    },
    // 所有居中方式
    allAlign: {
      type: String,
      default: "",
    },
    // 是否选用多个排序方式
    multipleSort: {
      type: Boolean,
      default: false
    },
    //文字超出时浮动显示样式
    tooltipEffect:{
      type: String,
      default: "light",
    },
    //是否高亮当前行   ylq 2022/11/03
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    //属性默认展开行
    defaultExpandAll:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allPageSelection: this.checkList || [], //checkbox选中的行包含分页选中的
      multipleSelection: [], //当前checkbox选中的行
      currentRow: null,
      tableColumns: this.columns,
      orderArray: []
    };
  },
  watch: {
    columns(val) {
      this.tableColumns = val;
    },
    checkList(rows) {},
    allPageSelection(val) {
      this.handleAllSelectionChange(val);
    },
    data(val) {
      this.allPageSelection = this.checkList || [];
      this.multipleSelection = null;
      setTimeout(() => {
        this.changeRowSelection(this.allPageSelection, this.id);
      }, 100);
    },
    multipleSelection: {
      handler(val, oldval) {
        //console.log(val, oldval, "00000jjj");
        if (this.multipleSelection == null) return; //避免切换分页的时候重置值
        if (!val) val = [];
        if (!oldval) oldval = [];
        const selList = this.allPageSelection.concat(val); //复制一个备份并且
        if (oldval.length > val.length) {
          //删除
          const delItem = oldval.filter((item) => {
            const isDel = val.findIndex((o) => o[this.id] == item[this.id]) < 0;
            const inPage =
              this.data.findIndex((o) => o[this.id] == item[this.id]) >= 0;
            return isDel && inPage;
          });
          if (delItem.length > 0) {
            delItem.forEach((obj) => {
              const delIndex = selList.findIndex(
                (item) => item[this.id] == obj[this.id]
              );
              if (delIndex >= 0) {
                selList.splice(delIndex, 1);
              }
            });
          }
        } else {
          //添加
          const addItem = val.filter((item) => !oldval.includes(item));
          if (addItem.length > 0) {
            addItem.forEach((obj) => {
              selList.push(obj);
            });
          }
        }
        this.allPageSelection = this.unique(selList); //去重
      },
      deep: true,
    },
  },
  created() {
    this.tableColumns = this.columns;
    this.tableColumns.map((item, index) => {
      if (item.prop == "operation") {
        this.$set(item, "showOverflowTooltip", false);
        this.$set(item, "fixed", "right");
      }
    });
  },
  mounted() {},
  methods: {
    // 列表序号自定义
    indexMethod(index) {
      let curIdx = index + 1;
      // (当前页-1)*每页条数+1----> 做第一个编号 然后循环+1;
      let idx = (this.pager.pageNo - 1) * this.pager.limit + curIdx;
      return idx;
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.rowClassNameControl) {
        return this.rowClassNameControl({
          row,
          rowIndex,
        });
      }
      return "";
    },
    //合并单元格
    spanMethodFun(spanObj) {
      if (this.spanControl) {
        return this.spanControl(spanObj);
      }
      return {
        rowspan: 1,
        colspan: 1,
      };
    },
    //加载树节点数据
    async load(tree, treeNode, resolve) {
      if (this.loadTree) {
        const treeVal = await this.loadTree();
        resolve(treeVal || []);
      } else {
        resolve([]);
      }
    },
    //控制复选框是否可以编辑
    checkboxInit(row, index) {
      if (this.checkboxControl) {
        if (this.checkboxControl(row, index)) {
          return 1;
        } else {
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
        hash[next[this.id]]
          ? ""
          : (hash[next[this.id]] = true && item.push(next));
        return item;
      }, []);
      //console.info('去重后的数组:', newArray);
      return newArray;
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
      const isIE=!!window.ActiveXObject || "ActiveXObject" in window
      const isFF=navigator.userAgent.toLowerCase().indexOf("firefox") > 0 ? true : false;
      if(isIE||isFF){
       return cellValue.replace(new RegExp(/-/gm) ,"/")
      }else{
       return cellValue;
      }
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
      if (this.data.findIndex((obj) => obj[this.id] == item[this.id]) >= 0) {
        //当在此页的数据
        const list = this.allPageSelection.filter(
          (obj) => obj[this.id] != item[this.id]
        );
        this.changeRowSelection(list, this.id);
      } else {
        this.allPageSelection = this.allPageSelection.filter(
          (obj) => obj[this.id] != item[this.id]
        );
      }
    },
    //ty-table方法,选中当前行
    changeRowSelection(rows, tag) {
      //tag是为了解决分页选不上的问题,表示判断两个对象相等的唯一标识
      if (!this.$refs.tyTableObj) return;
      this.$refs.tyTableObj.clearSelection();
      if (rows && rows.length > 0) {
        if (tag) {
          rows.forEach((row) => {
            const rr = (this.data || []).find((i) => i[tag] == row[tag]);
            rr && this.$refs.tyTableObj.toggleRowSelection(rr, true);
          });
        } else {
          rows.forEach((row) => {
            row && this.$refs.tyTableObj.toggleRowSelection(row, true);
          });
        }
      }
      this.allPageSelection = rows || [];
    },
    handleSelectFun(selection, row) {
      this.$emit("select", {
        selection,
        row,
      });
    },
    // 排序
    sortChange(val) {
      console.log('lll', val)
      // if (this.$refs.table) this.$refs.table.clearSort()
      this.$emit("sortMethod", val, this.orderArray);
    },
    // 筛选
    filterHandler(val) {
      this.$emit("filterChange", val);
    },
    // 获取列
    handleHeaderCellClass(val) {
      this.orderArray.forEach((element) => {
        if (val.column.property === element.prop) {
          val.column.order = element.order;
        }
      });
    },
    // 当某一行被点击时会触发该事件  ylq 2022/11/03
    rowClick(e){
      this.$emit("rowClick",e)
    }
  },
};
</script>
<style
  scoped
  lang="scss"
>
@import "../../../src/assets/icontyfilter/iconfont.css";
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
  ::v-deep.el-table__column-filter-trigger .el-icon-arrow-down {
    font-family: iconfonttywhp !important;
    font-size: 14px;
    color: #999;
    transform: unset;
  }
  ::v-deep.el-table__column-filter-trigger .el-icon-arrow-down:before {
    content: "\e6b6" !important;
  }
}
</style>
