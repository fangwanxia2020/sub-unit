<template>
  <el-form-item
    :class="[{'titleCom':widget.type=='title'||widget.component==true}]"
    :label="widget.name"
    :prop="widget.model"
    :label-width="itemLabelWidth"
    v-if="((!widget.options.hide)&&(!widget.options.hideLabel)&&(widget.type!='title'))"
  >
    <render-item :widget="widget" :value.sync="dataModel" >
      <template :slot="widget.options.slotName" slot-scope="{data}">
        <slot :name="widget.options.slotName" :data="data">  
        </slot>
      </template>
    </render-item>
    <p v-if="widget.options.tipFont" class="fmItem__tip">{{widget.options.tipFont}}</p>
  </el-form-item>
  <render-item :widget="widget" :value.sync="dataModel" v-else-if="(!widget.options.hide)">
    <template :slot="widget.options.slotName" slot-scope="{data}">
      <slot :name="widget.options.slotName" :data="data">         
      </slot>
    </template>
  </render-item>
</template>
<script>
import RenderItem from "./RenderItem";
export default {
  props: ["widget", "models", "rules","bindInfo"],
  components: {
    RenderItem
  },
  data() {
    return {
      dataModel: this.models[this.widget.model]
    };
  },
   computed: {   
    itemLabelWidth() {
      let val = "0px";
      if (this.widget.name) {
        val = "";
      }
      if (this.widget.type == 'title' || this.widget.component==true) {
        val = "0px";
      }
      return val;
    }
  },
  created() {
  },
  methods: {
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val;
        this.$emit("update:models", {
          ...this.models,
          [this.widget.model]: val
        });
        this.$emit("input-change", val, this.widget.model);
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model];
      }
    }
  }
};
</script>
<style scoped lang="scss">
.fmItem__tip{
   color:#999;
   padding:5px 0 0;
   margin:0;
   font-size:12px;
   line-height: 18px;
}
  .titleCom ::v-deep{
    padding: 0;

    >.el-form-item__label {
      text-align: left;
      display: none;
    }
    
    .form-title {
      padding: 0;
      margin: 0;
    }
  }
</style>