import TyDialog from './src/index';

/* istanbul ignore next */
TyDialog.install = function(Vue) {
  Vue.component(TyDialog.name,TyDialog);
};

export default TyDialog;
