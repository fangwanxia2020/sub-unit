export default function (type = 'vue') {
  if (type == 'template') {
    return `
    <div>
<ty-icon type="openEye">
</ty-icon>
 </div>
`
  } else if (type == 'script') {
    return `
    export default {
      data () {
        return {
        }
      },
      methods: {  
        ss(){
        }     
      }
    }`
  } else if (type == 'css') {
    return `
  `;
  }
}