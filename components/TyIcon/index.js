import TyIcon from './src/index';

/* istanbul ignore next */
TyIcon.install = function(Vue) {
  Vue.component(TyIcon.name,TyIcon);
};

export default TyIcon;
