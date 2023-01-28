<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import {
  getToken,
  setToken,
  removeToken
}
from 'utils/auth';
export default {
  name: 'App',
  created() {
    //模拟登录
    this.login();
  },
  methods: {
    login() {
      // 使用模拟账号数据登录
      const postData = {
        'username': 'admin',
        'password': 'admin123',
        'roleKey': 'admin',
        'tenantCode': 'admin',
        'code': ''
      };
      this.request({
        url: '/login',
        method: 'post',
        data: postData
      }).then(response => {
        const {
          token
        } = response;
        setToken(token);
      }).catch(error => {});
    },
  }
};

</script>
<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
// #nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }

</style>
