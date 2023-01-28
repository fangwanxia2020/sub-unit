import TyDialogSuper from './src/index';

/* istanbul ignore next */
TyDialogSuper.install = function(Vue) {
  Vue.component(TyDialogSuper.name,TyDialogSuper);
};

export default TyDialogSuper;
