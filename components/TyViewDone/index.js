import TyViewDone from './src/index';

/* istanbul ignore next */
TyViewDone.install = function(Vue) {
  Vue.component(TyViewDone.name,TyViewDone);
};

export default TyViewDone;
