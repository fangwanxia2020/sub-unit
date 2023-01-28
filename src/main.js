import '@babel/polyfill';
import Vue from 'vue';
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';
import { Tree } from 'element-ui';
Vue.use(Tree);

//初始化组件变量
import { initApi } from 'utils/auth';
//一定要先设置baseUrl
Vue.prototype.baseUrl = process.env.VUE_APP_BASE_API;
//m1:原先接口定义 m2:东云接口定义
Vue.prototype.request = initApi({ 'router': router,'tokenkey': 'tyTemplate_token','outVue': Vue },"m2");
//引入全局变量
import plugins from '@/assets/js/plugins';
Vue.use(plugins);

//调用公共组件
import DVU3 from 'ty-pc'
Vue.use(DVU3)


Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
