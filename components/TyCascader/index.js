import TyCascader from './src/index';

/* istanbul ignore next */
TyCascader.install = function(Vue) {
  Vue.component(TyCascader.name,TyCascader);
};

export default TyCascader;
