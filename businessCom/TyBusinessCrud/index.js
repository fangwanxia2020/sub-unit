import TyBusinessCrud from './src/index';
/* istanbul ignore next */
TyBusinessCrud.install = function (Vue) {
  Vue.component(TyBusinessCrud.name,TyBusinessCrud);
};

export default TyBusinessCrud;
