<template>
  <div>
    <ty-business-crud
      id="configId"
      title="机构权限"
      ref="jsCrudObj"
      searchMode="high"
      hide-page
      search-form-label-suffix=""
      :getListInterface="{url:'/grantCodeConfig/grantCodeManager/list',methodType:'post'}"
      :saveInterface="{url:'/grantCodeConfig/grantCodeManager/add',methodType:'post'}"
      :updateInterface="{url:'/grantCodeConfig/grantCodeManager/edit',methodType:'post'}"
      :showSearchFields="['grantCode', 'prop1', 'prop2']"
      :columns="columns"
      @highSearchChange="$event => isShowHighSearch = $event"
    >
      <template #baseSearch>
        <span class="el-form-item el-form-item--medium search-item search-item--base">
          <label class="el-form-item__label">知识竞赛:</label>
          <div class="el-form-item__content">
            dsadadsa
          </div>
        </span>
      </template>
      <template v-if="isShowHighSearch" #search>
        <span class="el-form-item el-form-item--medium search-item">
          <label class="el-form-item__label">知识竞赛:</label>
          <div class="el-form-item__content">
            dsadadsa
          </div>
        </span>
      </template>
      <template #btnsBar>
        <div class="btns">aaa</div>
      </template>
      <div slot="detail">asasa</div>
    </ty-business-crud>
  </div>
</template>
<script>
export default {
  name: "design",
  components: {},
  data() {
    return {
      isShowHighSearch: false, 
      //字段
      columns: [{
        label: "权限编号", //字段名
        prop: "grantCode", //字段key
        search: true, //是否出现在搜索栏
        required: false, //新增修改是否必填
        baseSearch: true,
        edit: false, //是否出现在新增修改
        formatType: 'input', //类型
      }, {
        label: "权限控制",
        prop: "dictLabel",
        search: true,
        baseSearch: true,
        required: true,
        edit: false,
        formatType: 'select',
        options: [ //如果是单选，多选，下拉框需要有选项
          {
            value: '17',
            label: '正常'
          }, {
            value: '18',
            label: '停用'
          }
        ]
      }, {
        label: "创建时间",
        prop: "createTime",
        type: "datetime",
        search: true,
        required: true,
        edit: false,
        width: 200,
        formatType: 'daterange',
      }, {
        label: "测试高级属性1",
        prop: "prop1",
      }, {
        label: "测试高级属性2",
        prop: "prop2",
      }, {
        prop: "operation",
        label: "操作",
        width: 200,
        type: "operation",
        fixed: "right",
      }]
    }
  },
  created() {},
  watch: {},
  methods: {}
};

</script>
<style
  scoped
  lang="less"
>
</style>
