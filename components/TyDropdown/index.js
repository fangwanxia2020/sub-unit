import TyDropdown from './src/index';

/* istanbul ignore next */
TyDropdown.install = function (Vue) {
  Vue.component(TyDropdown.name,TyDropdown);
};

export default TyDropdown;
