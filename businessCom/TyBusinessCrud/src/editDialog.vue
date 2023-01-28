<template>
  <!--新建或者修改  -->
  <ty-dialog
    :show.sync="dialogVisibel"
    :title="`${(data&&data[crudObj.id])?`${disabled?'查看':'修改'}`:'新增'}${crudObj.title}`"
    width="700px"
    :onOk="upadateFun"
  >
    <div style="padding:0 100px 0 0;">
      <pc-form
        :disabled="disabled"
        :data="jsonData"
        :value="editData"
        ref="generateForm"
        style="padding:0 20px;"
        v-if="dialogVisibel"
      >
      </pc-form>
      <slot></slot>
    </div>
  </ty-dialog>
</template>
<script>
import {
  addRow,
  editRow
}
from "./api"
import PcForm from "components/PcForm";
import TyDialog from "components/TyDialog";
export default {
  name: "EditDialog",
  components: {
    TyDialog,
    PcForm
  },
  props: {
    disabled: {
      //弹出窗的显示隐藏
      type: Boolean,
      default: false
    },
    show: {
      //弹出窗的显示隐藏
      type: Boolean,
      default: false
    },
    data: {
      //详情内容
      type: Object
    },
    editFormData: {
      //表单格式
      type: Array,
      default: () => []
    }
  },
  inject: ['crudObj'],
  computed: {},
  data() {
    return {
      jsonData: {},
      editData: this.data,
      dialogVisibel: false
    };
  },
  watch: {
    //不能直接修改props的值所以要定义多一个变量
    show(val) {
      this.dialogVisibel = val;
      if (!this.show) return;
    },
    //弹出窗组件显示隐藏状态发生改变要同步触发父级元素的修改
    dialogVisibel(val) {
      this.$emit("update:show", val);
    },
    data(val) {
      this.editData = val;
    }
  },
  created() {
    this.jsonData = {
      list: this.editFormData || [],
      config: {
        id: "form_1591861099000",
        labelWidth: 200,
        labelPosition: "right",
        size: "medium",
        formName: "111"
      }
    }
  },
  methods: {
    upadateFun() {
      this.$refs.generateForm.getData().then(data => {
        let fun = "";
        let txt = "";
        let interfaceObj = {};
        const allData = {
          ...this.data,
          ...data
        };
        if (allData[this.crudObj.id]) {
          //修改
          fun = editRow;
          txt = "修改";
          interfaceObj = this.crudObj.updateInterface;
        }
        else {
          //新增
          fun = addRow;
          txt = "新增";
          interfaceObj = this.crudObj.saveInterface;
        }
        let postData = {
          ...allData
        };
        const {
          params
        } = interfaceObj;
        if (params) {
          postData = {
            ...params,
            ...allData
          };
        }
        fun(postData, interfaceObj).then(res => {
          this.$message.success(`${txt}${this.crudObj.title}成功！`);
          this.dialogVisibel = false;
          this.$emit("refresh", {
            isAdd: txt == '新增',
            data: postData
          });
        });
      }).catch(e => {});
    }
  }
};

</script>
<style
  lang="scss"
  scoped
>
</style>
