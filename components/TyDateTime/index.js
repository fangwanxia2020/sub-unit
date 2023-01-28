import TyDateTime from './src/index';

/* istanbul ignore next */
TyDateTime.install = function (Vue) {
  Vue.component(TyDateTime.name,TyDateTime);
};

export default TyDateTime;
