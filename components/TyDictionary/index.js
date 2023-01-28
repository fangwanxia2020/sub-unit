import TyDictionary from './src/index';

/* istanbul ignore next */
TyDictionary.install = function(Vue) {
  Vue.component(TyDictionary.name,TyDictionary);
};

export default TyDictionary;
