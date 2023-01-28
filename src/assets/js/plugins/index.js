/**
 * 为 Vue 添加全局功能
 */
import {addInstanceProperties} from '@/assets/js/plugins/constants.js';
import {addInstanceMethods} from '@/assets/js/plugins/methods.js';

 export default {
   install(Vue, options) {
     // 添加全局实例属性
     addInstanceProperties(Vue, options);
     // 添加全局实例方法
    addInstanceMethods(Vue, options);
   }
 }
