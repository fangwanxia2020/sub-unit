import TyRadio from './src/index';

/* istanbul ignore next */
TyRadio.install = function (Vue) {
  Vue.component(TyRadio.name,TyRadio);
};

export default TyRadio;
