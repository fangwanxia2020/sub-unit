<template>
  <div>
    <ty-pc-form :apiData="apiData"></ty-pc-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        apiData:null,
      }
    },
    created() {
      this.apiData = this.$route.params.id;
    },
  }
</script>

<style scoped>

</style>