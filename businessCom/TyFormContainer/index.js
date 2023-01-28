import TyFormContainer from './src/index';
/* istanbul ignore next */
TyFormContainer.install = function (Vue) {
  Vue.component(TyFormContainer.name,TyFormContainer);
};

export default TyFormContainer;