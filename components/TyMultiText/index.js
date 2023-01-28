import TyMultiText from './src/index';

/* istanbul ignore next */
TyMultiText.install = function (Vue) {
  Vue.component(TyMultiText.name,TyMultiText);
};

export default TyMultiText;
