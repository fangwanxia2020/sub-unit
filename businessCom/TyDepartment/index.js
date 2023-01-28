import TyDepartment from './src/index';
/* istanbul ignore next */
TyDepartment.install = function (Vue) {
  Vue.component(TyDepartment.name,TyDepartment);
};

export default TyDepartment;
