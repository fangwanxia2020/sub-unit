/*
 * @Author: hjm
 * @Date: 2022-11-28 11:43:02
 * @LastEditors: hjm
 * @LastEditTime: 2022-11-28 11:43:56
 * @Description: file contente
 */
import TyTree from './src/index';

/* istanbul ignore next */
TyTree.install = function(Vue) {
  Vue.component(TyTree.name,TyTree);
};

export default TyTree;
