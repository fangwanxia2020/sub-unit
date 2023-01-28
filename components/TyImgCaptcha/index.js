import TyImgCaptcha from './src/index';

/* istanbul ignore next */
TyImgCaptcha.install = function (Vue) {
  Vue.component(TyImgCaptcha.name,TyImgCaptcha);
};

export default TyImgCaptcha;
