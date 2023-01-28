<template>
  <div class="box">
    <ty-icon type="hamburger"></ty-icon>
    <ty-upload-file
      v-model="files"
      multiple
    >
      <template #fileOperator="slotProps">
        {{ slotProps }}
      </template>
    </ty-upload-file>
    <input
      type="file"
      name="file"
      multiple
      @change="handleFileChange"
    >
  </div>
</template>
<script>
export default {
  name: "demo",
  data() {
    return {
      files: [/* {
        "id":400,
        "label":"白云区雪碧物流",
      }, {
        "id":500,
        "label":"cascsacsacsa",
      } */],
      curData: {},
    };
  },
  watch: {
    list: {
      handler: function(val) {
        console.log('888', val)
      }
    }
  },
  methods: {
    handleFileChange(e) {
      const input = e.target
      const { files } = input
      console.log(files)
    }
  }
};

</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 600px;
  background: #fff;
  &-yy {
    width: 400px;
    height: 500px;
  }
}
</style>



