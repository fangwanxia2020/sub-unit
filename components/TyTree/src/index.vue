<template>
  <div class="ty-tree" 
    :style="{ minHeight: minHeight, height: height }">
    <el-input v-model="designation" 
      :placeholder="placeholder" 
      clearable 
      size="small" 
      prefix-icon="el-icon-search" 
      v-if="search"/>
    <!-- 组织树 -->
    <div ref="treeBox" >
      <el-tree class="tree-border" 
        v-bind="$attrs" 
        v-on="$listeners" 
        :filter-node-method="filterNode"
        ref="treeSuper">
        <span class="tree-node" 
          ref="child" 
          slot-scope="{ node }" >
          <el-tooltip  
            :effect="effect" 
            :content="node.label" 
            placement="top-start"
            v-if="tooltip">
            <span> {{ node.label}} </span>
          </el-tooltip>
          <span v-else> {{ node.label}} </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
/**
 * 组件名称 TyTree
 * @module components/data/TyTree
 * @desc 带收搜、tooltipt提示
 * @author hjm
 * @date 2022年11月28日 
 * @param {Boolean} [search]    - 是否显示收搜
 * @param {String} [placeholder] - 收搜框占位符
 * @param {String} [minHeight] - 最小高度
 * @param {String} [height] - 高度
 * @param {Boolean} [tooltip] - 是否显示tooltip提示
 * @param {String} [effect] - tooltip主题
 * @example 调用示例
 *    <ty-tree
        :data>
      </ty-table>
 **/
export default {
  name: "TyTree",
  props: {
    // 是否收搜
    search: {
      type: Boolean,
      default: true,
    },
    // 占位符
    placeholder: {
      type: String,
      default: "请输入",
    },
    // 最小高度
    minHeight: {
      type: String,
      default: "100%",
    },
    // 高度
    height: {
      type: String,
      default: "100%",
    },
    // tooltip 提示
    tooltip: {
      type: Boolean,
      default: true,
    },
    // tooltip 两个不同的主题 dark和light
    effect: {
      type: String,
      default: 'dark'
    }
  },
  data() {
    return {
      designation: "", // 组织树名称
      flag: true,
    };
  },
  watch: {
    // 通过关键字过滤树节点
    designation(val) {
      this.$refs.treeSuper.filter(val);
    },
  },
  created() {
    
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  }
};

</script>
<style
  scoped
  lang="scss"
>
.el-tree {
  &::-webkit-scrollbar {
    width: 3px;
    height: 0px;
  }
}
.organization {
  width: 100%;
  height: 100%;
}
.treeBox {
  height: calc(100% - 32px);
  margin-top: 5px;
  box-sizing: border-box;
}
.el-tree {
  height: calc(100% - 5px);
  overflow-y: auto;
  box-sizing: border-box;
  margin: 0;
}
.tree-node {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
