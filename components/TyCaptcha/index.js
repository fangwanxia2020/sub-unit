import TyCaptcha from './src/index';

/* istanbul ignore next */
TyCaptcha.install = function(Vue) {
  Vue.component(TyCaptcha.name,TyCaptcha);
};

export default TyCaptcha;
