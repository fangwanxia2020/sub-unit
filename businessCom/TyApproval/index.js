import TyApproval from './src/index';
/* istanbul ignore next */
TyApproval.install = function (Vue) {
  Vue.component(TyApproval.name,TyApproval);
};

export default TyApproval;
