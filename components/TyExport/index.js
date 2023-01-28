import TyExport from './src/index';

/* istanbul ignore next */
TyExport.install = function(Vue) {
  Vue.component(TyExport.name,TyExport);
};

export default TyExport;
