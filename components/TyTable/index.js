import TyTable from './src/index';

/* istanbul ignore next */
TyTable.install = function(Vue) {
  Vue.component(TyTable.name,TyTable);
};

export default TyTable;
