import TyPcForm from './src/index';
/* istanbul ignore next */
TyPcForm.install = function (Vue) {
  Vue.component(TyPcForm.name,TyPcForm);
};

export default TyPcForm;