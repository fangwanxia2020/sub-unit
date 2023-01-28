<template>
  <div>
    <ty-pc-form
      :apiData="id"
      :detailFlag="detailFlag"
      v-bind="$attrs"
      v-on="$listeners"
    ></ty-pc-form>
  </div>
</template>

<script>
import { DETAIL } from '../../TyPcForm/src/constants'
import { getLastPath } from './handleFormData'

export default {
  name: "TyFormContainer",
  inheritAttrs: false,
  props: {
    templateId: {
      type: [String,Number],
      default: null
    }
  },
  watch: {
    templateId(newVal) {
      this.id = newVal
    }
  },
  data() {
    return {
      detailFlag: false,
      id: this.templateId
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const lastPath = getLastPath(this.$route)
      this.id = this.templateId || this.$route.params.id
      if (DETAIL === lastPath) this.detailFlag = true
    }
  }
}
</script>

<style type="text/css"></style>
