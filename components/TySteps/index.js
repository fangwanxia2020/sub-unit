import TySteps from './src/index';

/* istanbul ignore next */
TySteps.install = function(Vue) {
  Vue.component(TySteps.name,TySteps);
};

export default TySteps;
