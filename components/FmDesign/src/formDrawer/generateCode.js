export default function (data,type = 'vue') {

  if (type == 'template') {
    return `
  <div class="fmBox">  
    <pc-form :data="jsonData"  v-model="editData" ref="generateForm"> 
    </pc-form>
    <div class="fmBox-btn">
    <el-button type="primary" @click="handleSubmit" size="medium">提交</el-button>
    </div>
  </div>
`
  } else if (type == 'script') {
    return `
    export default {
      data () {
        return {
          jsonData: ${data},
          editData: {},
        }
      },
      methods: {
        handleSubmit () {
          this.$refs.generateForm.getData().then(data => {
            // success
            alert("表单的值"+JSON.stringify(data));
          }).catch(e => {
            // error
          })
        }
      }
    }`
  } else if (type == 'css') {
    return `.fmBox{
      overflow:hidden;
      padding:20px;
      border:1px solid #ddd;
      margin:20px;
    }
    .fmBox-btn{
      padding-top:10px;
      text-align:center;
    }`;
  }
}
