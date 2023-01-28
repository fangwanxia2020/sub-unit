import TyUpload from './src/index';

/* istanbul ignore next */
TyUpload.install = function(Vue) {
  Vue.component(TyUpload.name,TyUpload);
};

export default TyUpload;
