<template>
  <div class="form-config-container">
    <el-form
      label-position="top"
      size="mini"
    >
      <el-form-item label="表单Id">
        <el-input v-model="data.id"></el-input>
      </el-form-item>
      <el-form-item label="表单名称">
        <el-input v-model="data.formName"></el-input>
      </el-form-item>
      <el-form-item label="标签对齐方式">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表单标签宽度">
        <el-input-number
          v-model="data.labelWidth"
          :min="0"
          :max="200"
          :step="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="组件尺寸">
        <el-radio-group v-model="data.size">
          <el-radio-button label="large">large</el-radio-button>
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表单属性（适用于移动端）">
        <el-radio-group v-model="data.column">
          <el-radio-button label="column">通栏</el-radio-button>
          <el-radio-button label="nonColumn">非通栏</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ["data"]
};

</script>
