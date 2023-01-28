import TyEditTable from './src/index';

/* istanbul ignore next */
TyEditTable.install = function (Vue) {
  Vue.component(TyEditTable.name,TyEditTable);
};

export default TyEditTable;
