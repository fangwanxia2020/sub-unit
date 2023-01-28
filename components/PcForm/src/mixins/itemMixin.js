import PcFormItem from "../PcFormItem";

export const itemMixin = {
  components: {
    PcFormItem,
  },
  props:{
    item:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    models:{
      type:Object,
      default:()=>{
        return {}
      }
    },
  },
  data() {
    return {
      dataModel:this.models
    }
  },
  watch:{
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val;
      },
    },
  },
  methods:{

  }
}