import FmDesign from './src/index';

/* istanbul ignore next */
FmDesign.install = function(Vue) {
  Vue.component(FmDesign.name,FmDesign);
};

export default FmDesign;
