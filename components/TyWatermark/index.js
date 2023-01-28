import TyWatermark from './src/index';

/* istanbul ignore next */
TyWatermark.install = function(Vue) {
  Vue.component(TyWatermark.name,TyWatermark);
};

export default TyWatermark;
