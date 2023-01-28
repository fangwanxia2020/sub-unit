<template>
  <div>
    <div v-for="attrItem in item.list" :key="attrItem.key">
      <pc-form-item
        :key="attrItem.key"
        v-bind="$attrs"
        :widget="attrItem"
        v-on="$listeners"
        :models.sync="dataModel"
      >
        <div
          :slot="attrItem.options.slotName"
          slot-scope="{data}"
        >
          <slot
            :name="attrItem.options.slotName"
            :data="data"
          ></slot>
        </div>
      </pc-form-item>
    </div>
  </div>
</template>

<script>
  import { itemMixin } from '../mixins/itemMixin';
  export default {
    mixins: [itemMixin],
    data() {
      return {
        
      }
    }
  }
</script>

<style scoped>

</style>