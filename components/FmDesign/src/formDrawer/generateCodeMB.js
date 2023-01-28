export default function (data,type = 'vue') {
  if (type == 'template') {
    return `
  <view class="fmBox">
    <ty-mobile-form :data="jsonData"  :value="editData" ref="generateForm"> 
    </ty-mobile-form>
    <view class="fmBox-btn">
    <button type="primary" @click="handleSubmit">提交</button>
    </view>
  </view>
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
       padding-bottom:150px;
    }
    .fmBox-btn{
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      text-align:center;
          
    }
    .fmBox-btn uni-button{
      border-radius:0;
    }  
    
    `;
  }
}
