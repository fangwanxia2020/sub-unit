<template>
  <el-row
    :key="item.key"
    type="flex"
    :gutter="item.options.gutter ? item.options.gutter : 0"
    :justify="item.options.justify"
    :align="item.options.align"
  >
    <el-col
      v-for="(col, colIndex) in item.columns"
      :key="colIndex"
      :span="col.span"
    >
      <template v-for="citem in col.list">
        <pc-form-item
          :key="citem.key"
          :models.sync="dataModel"
          :rules="rules"
          :widget="citem"
          v-on="$listeners"
          v-bind="$attrs"
        >
          <template
            :slot="citem.options.slotName"
            slot-scope="{data}"
          >
            <slot
              :name="citem.options.slotName"
              :data="data"
            >
          </slot>
          </template>
        </pc-form-item>
      </template>
    </el-col>
  </el-row>
</template>

<script>
  import { itemMixin } from '../mixins/itemMixin';
  export default {
    mixins: [itemMixin],
    props: {
      rules:{
        type:Object,
        default:()=>{
          return {}
        }
      },
    },
    data() {
      return {
      }
    },
    methods: {
    },
  }
</script>

<style scoped>

</style>