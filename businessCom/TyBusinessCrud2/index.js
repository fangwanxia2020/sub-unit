/*
 * @Author: hjm
 * @Date: 2022-09-19 10:38:07
 * @LastEditors: hjm
 * @LastEditTime: 2022-09-19 10:38:51
 * @Description: file content
 */
import TyBusinessCrud2 from './src/index';
/* istanbul ignore next */
TyBusinessCrud2.install = function (Vue) {
  Vue.component(TyBusinessCrud2.name,TyBusinessCrud2);
};

export default TyBusinessCrud2;
