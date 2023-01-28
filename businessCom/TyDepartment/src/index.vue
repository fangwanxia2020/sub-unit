<template>
  <div class="department-tree">
    <div :style="{ width: width ? width + 'px' : '' }">
      <el-input
        v-if="isSearch"
        v-model="deptName"
        placeholder="请输入部门名称"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="margin-bottom: 10px"
      />
      <div v-if="showOperation" class="opr-sty">
        <div>
          <el-button size="small" @click="checkAll">全选</el-button>
          <el-button size="small" @click="resetChecked">清空</el-button>
        </div>

        <div class="opr-sty_number">已选{{ choseNumber }}项</div>
      </div>
      <el-tree
        class="tree-overflow-x-auto"
        ref="deptTree"
        :show-checkbox="showCheckbox"
        :node-key="id"
        default-expand-all
        :default-checked-keys="defaultDept"
        :data="deptOptions"
        :props="defaultProps"
        :expand-on-click-node="false"
        :check-strictly="checkStrictlyVal"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        @check="handleCheckChange"
      >
        <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="font-size: 14px">{{ node.label }}</span>
      </span> -->
        <!-- <template slot-scope="scope">
           <slot name="tree-slot" v-bind:data="scope.node"/>
       </template> -->
      </el-tree>
    </div>
  </div>
</template>
<script>
import { getTree } from "./api";
export default {
  name: "TyDepartment",
  props: {
    // 是否支持按部门搜索
    isSearch: {
      type: Boolean,
      default: false,
    },
    // 显示勾选框
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    // key值名称
    id: {
      type: String,
      default: "id",
    },
    //查询列表接口信息
    getListInterface: {
      type: Object,
      default: () => {
        return {
          url: "", //接口地址
          params: {}, //传参数据
          methodType: "", //接口请求类型
          resFormatFun: null, //返回数据格式方法,返回data
          timeout: 6e5, // 默认 10 分钟
        };
      },
    },
    // 默认勾选的节点的 key 的数组
    defaultDept: {
      type: Array,
      default: () => [],
    },
    //部门树选项
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          hasChildren: "hasChildren",
        };
      },
    },
    data: {
      type: Array,
      default: () => [],
    },
    // 是否开启懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
    // 父子不关联模式
    checkStrictly: {
      type: Boolean,
      default: true,
    },
    // 勾选中的数据
    checkData: {
      type: Array,
      default: () => [],
    },
    // 是否单选模式
    isSingleChoice: {
      type: Boolean,
      default: false,
    },
    // 树宽度
    width: {
      type: Number | String,
      default: "",
    },
    //清空、全选按钮
    showOperation: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      deptOptions: this.data || [],
      setCheckData: this.checkData || [],
      deptName: "",
      choseNumber: 0, //已选择数据
      checkStrictlyVal: true, //父子不关联
    };
  },
  created() {
    if (this.data.length == 0) {
      this.getData();
    } else {
      this.deptOptions = this.changeId(this.deptOptions);
    }
    if (this.checkData && this.checkData[0]) {
      let ids = this.checkData.map((item) => {
        return item.id;
      });
      setTimeout(() => {
        this.$refs.deptTree.setCheckedKeys(ids);
      }, 100);
    }
    this.checkStrictlyVal = this.checkStrictly;
  },
  watch: {
    deptName(val) {
      this.$refs.deptTree.filter(val);
    }
  },
  methods: {
    //对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点被点击事件
    handleNodeClick(val) {
      this.$emit("nodeClick", val);
    },
    // 节点选择事件
    handleCheckChange(checkedNodes, arr) {
      //控制单选
      if (this.isSingleChoice && arr.checkedKeys.length > 1) {
        this.$refs.deptTree.setCheckedKeys([checkedNodes.id]);
      }
      //当前勾选数据
      let chV = this.$refs.deptTree.getCheckedNodes();
      this.choseNumber = chV.length;
      this.$emit("update:checkData", chV);
      //节点选择事件
      this.$emit("checkChange", checkedNodes, arr);
    },
    // 设置选择数据--------不要
    setChecked() {
      let chV = this.$refs.deptTree.getCheckedNodes();
      this.$emit("update:checkData", chV);
    },
    // 请求接口数据
    getData() {
      let postData = {};
      const { params, resFormatFun } = this.getListInterface;
      if (params) {
        postData = {
          ...params,
        };
      }
      // if (this.isSearch) {
      //   postData.deptName = this.deptName;
      // }
      getTree(postData, this.getListInterface).then((res) => {
        this.deptOptions = res.data;
        if (resFormatFun) {
          const formatObj = resFormatFun(res);
          this.deptOptions = formatObj.data;
        }
        this.deptOptions = this.changeId(this.deptOptions);
        // if (this.checkData && this.checkData[0]) {
        //   let ids = this.checkData.map((item) => {
        //     return item.id;
        //   });
        //   this.$refs.deptTree.setCheckedKeys(ids);
        // }
      });
    },

    isArray(obj) {
      // 判断是否是数组类型
      return Object.prototype.toString.call(obj) === "[object Array]";
    },

    changeId(source) {
      for (var i in source) {
        var item = source[i].children;
        source[i].id = String(source[i].id);
        if (this.isArray(item)) {
          for (var val of item) {
            val.id = String(val.id);
          }
          this.changeId(item);
        } else {
          //   console.log("wuwuwu", item);
        }
      }
      return source;
    },

    // 清空
    resetChecked() {
      this.choseNumber = 0;
      this.$refs.deptTree.setCheckedKeys([]);
      this.$emit("update:checkData", []);
      // this.$emit('resetChecked', )
    },
    // 全选
    checkAll() {
      this.checkStrictlyVal = false;
      setTimeout(() => {
        this.$refs.deptTree.setCheckedNodes(this.deptOptions);
        let chV = this.$refs.deptTree.getCheckedNodes();
        this.choseNumber = chV.length;
        this.$emit("update:checkData", chV);
      }, 100);
    },
  },
};
</script>
 <style lang="scss" scoped>
.department-tree {
  width: inherit;
  height: inherit;
}

.opr-sty {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  &_number {
    color: #666;
    font-size: 14px;
  }
  ::v-deep .el-button--small {
    padding: 7px 12px;
  }
}
::v-deep {
  .el-tree {
    max-height: 600px;
    overflow: auto;
    &.tree-overflow-x-auto {
      overflow-x: auto;
      > .el-tree-node {
        display: inline-block;
        min-width: 100%;
      }
    }
  }
}
</style>