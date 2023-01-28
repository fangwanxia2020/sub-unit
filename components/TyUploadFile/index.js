import TyUploadFile from './src/index';

/* istanbul ignore next */
TyUploadFile.install = function(Vue) {
  Vue.component(TyUploadFile.name,TyUploadFile);
};

export default TyUploadFile;
