import TyCheckbox from './src/index';

/* istanbul ignore next */
TyCheckbox.install = function (Vue) {
  Vue.component(TyCheckbox.name,TyCheckbox);
};

export default TyCheckbox;
