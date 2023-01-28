import Draggable from "vuedraggable";
import FmCtnItem from "../FmCtnItem";
import { eventBus } from '../../eventBus/bindEventBus';

export const itemMixin = {
  components: {
    Draggable,
    FmCtnItem
  },
  props:['element','itemIndex','data'],
  data() {
    return {
      selectWidget:{}
    }
  },
  mounted() {
    eventBus.$on('getSelectWidget',data=>{
      this.selectWidget = data;
    });
  },
  methods:{
    handleWidgetDelete(index) {
      let selectItem = {}
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          selectItem = {};
        }
        else {
          selectItem = this.data.list[index - 1];
        }
      }
      else {
        selectItem = this.data.list[index + 1];
      }
      eventBus.$emit('getSelectWidget',selectItem);
      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleSelectWidget(index) {
      let selectItem = this.data.list[index];
      eventBus.$emit('getSelectWidget',selectItem);
    },
  },
}