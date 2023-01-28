/*
 * @Author: hjm
 * @Date: 2022-09-19 10:38:07
 * @LastEditors: hjm
 * @LastEditTime: 2022-12-05 10:12:33
 * @Description: file content
 */
import TyBusinessUploadExport from './src/index';
/* istanbul ignore next */
TyBusinessUploadExport.install = function (Vue) {
  Vue.component(TyBusinessUploadExport.name,TyBusinessUploadExport);
};

export default TyBusinessUploadExport;
