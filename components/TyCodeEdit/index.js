import TyCodeEdit from './src/index';

/* istanbul ignore next */
TyCodeEdit.install = function(Vue) {
  Vue.component(TyCodeEdit.name,TyCodeEdit);
};

export default TyCodeEdit;
